"""
SkinDiseasePredictor — loads the saved EfficientNet model and runs inference.
"""

import os
import numpy as np
import tensorflow as tf
from typing import Dict

class FocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        ce     = -y_true * tf.math.log(y_pred)
        weight = self.alpha * y_true * tf.pow(1 - y_pred, self.gamma)
        return tf.reduce_mean(tf.reduce_sum(weight * ce, axis=1))

    def get_config(self):
        config = super().get_config()
        config.update({'gamma': self.gamma, 'alpha': self.alpha})
        return config

CLASSES: Dict[int, tuple] = {
    0: ("nv",    "Melanocytic Nevi"),
    1: ("mel",   "Melanoma"),
    2: ("bkl",   "Benign Keratosis-like Lesions"),
    3: ("bcc",   "Basal Cell Carcinoma"),
    4: ("akiec", "Actinic Keratoses / Intraepithelial Carcinoma"),
    5: ("vasc",  "Vascular Lesions"),
    6: ("df",    "Dermatofibroma"),
}

RISK_LEVELS: Dict[str, str] = {
    "nv":    "low",
    "mel":   "high",
    "bkl":   "low",
    "bcc":   "high",
    "akiec": "medium",
    "vasc":  "low",
    "df":    "low",
}

CONDITION_DESCRIPTIONS: Dict[str, str] = {
    "nv": (
        "Melanocytic Nevi are common benign moles formed by clusters of melanocytes. "
        "Most are harmless, but monitor for ABCDEs: Asymmetry, Border, Color, Diameter, Evolution."
    ),
    "mel": (
        "Melanoma is the most dangerous form of skin cancer, developing from melanocytes. "
        "Early detection is critical — consult a dermatologist immediately."
    ),
    "bkl": (
        "Benign Keratosis-like Lesions (seborrheic keratosis, solar lentigo) are non-cancerous "
        "growths that often appear with age. They have a waxy, stuck-on appearance."
    ),
    "bcc": (
        "Basal Cell Carcinoma is the most common skin cancer. It rarely spreads but can cause "
        "local tissue damage if untreated. Usually appears on sun-exposed areas."
    ),
    "akiec": (
        "Actinic Keratoses are rough, scaly patches caused by sun damage that may become "
        "cancerous over time. Prompt evaluation by a dermatologist is recommended."
    ),
    "vasc": (
        "Vascular Lesions include cherry angiomas, angiokeratomas, and pyogenic granulomas. "
        "Most are benign but sudden changes warrant medical evaluation."
    ),
    "df": (
        "Dermatofibroma is a common benign skin nodule, often found on the lower legs. "
        "It typically feels firm, dimples when pinched, and is harmless."
    ),
}

CONFIDENCE_THRESHOLD = 0.65


class SkinDiseasePredictor:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(os.path.dirname(__file__), "efficientnet_skin.h5")
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            print(f"[Predictor] Loading model from {self.model_path} ...")
            self.model = tf.keras.models.load_model(
                self.model_path,
                custom_objects={
                    'FocalLoss': FocalLoss,
                    'focal_loss_1': FocalLoss()
                }
            )
            print("[Predictor] Model ready.")
        else:
            print(
                f"[Predictor] WARNING: Model file not found at {self.model_path}.\n"
                "Run python model/train.py to train and save the model first."
            )

    def predict(self, preprocessed_image: np.ndarray) -> dict:
        if self.model is None:
            raise RuntimeError(
                "Model is not loaded. Please train the model first by running model/train.py"
            )

        probs: np.ndarray = self.model.predict(preprocessed_image, verbose=0)[0]

        predictions = {}
        for idx, (code, name) in CLASSES.items():
            predictions[code] = {
                "name":        name,
                "probability": float(probs[idx]),
                "risk":        RISK_LEVELS[code],
                "description": CONDITION_DESCRIPTIONS[code],
            }

        top_idx    = int(np.argmax(probs))
        top_code   = CLASSES[top_idx][0]
        top_name   = CLASSES[top_idx][1]
        confidence = float(probs[top_idx])

        sorted_items = sorted(predictions.items(), key=lambda x: x[1]["probability"], reverse=True)
        top3 = [{"code": k, **v} for k, v in sorted_items[:3]]

        return {
            "predictions":        predictions,
            "top3":               top3,
            "top_condition":      top_code,
            "top_condition_name": top_name,
            "confidence":         confidence,
            "needs_questions":    confidence < CONFIDENCE_THRESHOLD,
            "risk_level":         RISK_LEVELS[top_code],
            "description":        CONDITION_DESCRIPTIONS[top_code],
        }