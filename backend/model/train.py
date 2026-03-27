"""
HAM10000 Skin Disease Classifier — Training Script
Uses EfficientNetB0 with transfer learning + fine-tuning.

Usage:
  1. Set DATASET_PATH to your HAM10000 folder.
  2. Run: python model/train.py
  3. Model saved as model/efficientnet_skin.h5
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
DATASET_PATH = "./data"          # Root folder of HAM10000 dataset
IMAGE_SIZE   = (224, 224)
BATCH_SIZE   = 32
EPOCHS_HEAD  = 10                # Phase 1: train head only
EPOCHS_FINE  = 20                # Phase 2: fine-tune top layers
NUM_CLASSES  = 7
MODEL_OUTPUT = "model/efficientnet_skin.h5"

CLASS_MAP = {
    'nv':    0,   # Melanocytic Nevi
    'mel':   1,   # Melanoma
    'bkl':   2,   # Benign Keratosis-like Lesions
    'bcc':   3,   # Basal Cell Carcinoma
    'akiec': 4,   # Actinic Keratoses
    'vasc':  5,   # Vascular Lesions
    'df':    6,   # Dermatofibroma
}
CLASS_NAMES = list(CLASS_MAP.keys())


# ─────────────────────────────────────────────
# Data loading
# ─────────────────────────────────────────────
def load_dataset(dataset_path: str) -> pd.DataFrame:
    metadata_path = os.path.join(dataset_path, "HAM10000_metadata.csv")
    if not os.path.exists(metadata_path):
        raise FileNotFoundError(f"Metadata CSV not found at {metadata_path}")

    df = pd.read_csv(metadata_path)

    img_dirs = [
        os.path.join(dataset_path, "HAM10000_images_part_1"),
        os.path.join(dataset_path, "HAM10000_images_part_2"),
    ]

    def find_image(image_id: str) -> str | None:
        for d in img_dirs:
            p = os.path.join(d, f"{image_id}.jpg")
            if os.path.exists(p):
                return p
        return None

    df["path"]  = df["image_id"].apply(find_image)
    df["label"] = df["dx"].map(CLASS_MAP)
    df = df.dropna(subset=["path", "label"])

    print(f"Dataset loaded: {len(df)} images")
    print(df["dx"].value_counts().to_string())
    return df


# ─────────────────────────────────────────────
# Model architecture
# ─────────────────────────────────────────────
def build_model() -> Model:
    base = EfficientNetB0(
        weights="imagenet",
        include_top=False,
        input_shape=(*IMAGE_SIZE, 3),
    )
    base.trainable = False  # Freeze for Phase 1

    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3))
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.35)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(NUM_CLASSES, activation="softmax")(x)

    return Model(inputs, outputs)


# ─────────────────────────────────────────────
# Data generators
# ─────────────────────────────────────────────
def make_generators(train_df: pd.DataFrame, val_df: pd.DataFrame):
    train_aug = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=30,
        width_shift_range=0.15,
        height_shift_range=0.15,
        horizontal_flip=True,
        vertical_flip=True,
        zoom_range=0.15,
        shear_range=0.1,
        brightness_range=[0.8, 1.2],
    )
    val_aug = ImageDataGenerator(rescale=1.0 / 255)

    gen_kwargs = dict(
        x_col="path",
        y_col="dx",
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        classes=CLASS_NAMES,
        seed=42,
    )

    train_gen = train_aug.flow_from_dataframe(train_df, **gen_kwargs)
    val_gen   = val_aug.flow_from_dataframe(val_df,   **gen_kwargs, shuffle=False)
    return train_gen, val_gen


# ─────────────────────────────────────────────
# Training
# ─────────────────────────────────────────────
def train():
    # GPU memory growth
    for gpu in tf.config.list_physical_devices("GPU"):
        tf.config.experimental.set_memory_growth(gpu, True)

    df = load_dataset(DATASET_PATH)

    train_df, val_df = train_test_split(
        df, test_size=0.2, random_state=42, stratify=df["label"]
    )

    # Balanced class weights (HAM10000 is very imbalanced; nv ≈67%)
    weights = compute_class_weight(
        class_weight="balanced",
        classes=np.arange(NUM_CLASSES),
        y=train_df["label"].values,
    )
    class_weight_dict = dict(enumerate(weights))
    print("\nClass weights:", {CLASS_NAMES[k]: f"{v:.2f}" for k, v in class_weight_dict.items()})

    train_gen, val_gen = make_generators(train_df, val_df)
    model = build_model()
    model.summary()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_auc", mode="max", patience=5, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7
        ),
        tf.keras.callbacks.ModelCheckpoint(
            MODEL_OUTPUT, monitor="val_auc", mode="max", save_best_only=True
        ),
        tf.keras.callbacks.TensorBoard(log_dir="./logs"),
    ]

    # ── Phase 1: Train only the head ──────────────────
    print("\n[Phase 1] Training classification head …")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.AUC(name="auc")],
    )
    model.fit(
        train_gen,
        epochs=EPOCHS_HEAD,
        validation_data=val_gen,
        class_weight=class_weight_dict,
        callbacks=callbacks,
    )

    # ── Phase 2: Fine-tune top 30 layers of EfficientNet ──
    print("\n[Phase 2] Fine-tuning top layers …")
    base_model = model.layers[1]  # EfficientNetB0
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.AUC(name="auc")],
    )
    model.fit(
        train_gen,
        epochs=EPOCHS_FINE,
        validation_data=val_gen,
        class_weight=class_weight_dict,
        callbacks=callbacks,
    )

    # ── Evaluation ────────────────────────────────────
    print("\n[Evaluation]")
    results = model.evaluate(val_gen, verbose=1)
    print(f"  val_loss={results[0]:.4f}  val_acc={results[1]:.4f}  val_auc={results[2]:.4f}")
    print(f"\nModel saved → {MODEL_OUTPUT}")


if __name__ == "__main__":
    train()
