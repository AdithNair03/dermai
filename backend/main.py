"""
Skin Symptom Analysis API — FastAPI backend
Run with:  uvicorn main:app --reload --port 8000
"""

import io
from typing import Dict

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

from model.predict import SkinDiseasePredictor
from utils.preprocess import preprocess_image
from utils.refinement import get_questions_for_condition, refine_prediction

# ─────────────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────────────
app = FastAPI(
    title="Skin Symptom Analysis API",
    description=(
        "AI-powered dermatoscopic image analysis using EfficientNet trained on HAM10000. "
        "For awareness purposes only — not a diagnostic tool."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singleton predictor (loads model once at startup)
predictor = SkinDiseasePredictor()


# ─────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────
class RefinementRequest(BaseModel):
    initial_predictions: Dict[str, float]   # {condition_code: probability}
    top_condition:        str
    answers:              Dict[str, int]    # {question_id: 0|1|2}


# ─────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {
        "status":       "ok",
        "model_loaded": predictor.model is not None,
    }


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept a skin image (JPEG/PNG), run EfficientNet inference,
    and return probability distribution + confidence.
    """
    allowed = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG/WebP images are accepted.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="Image size must be under 10 MB.")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not decode the uploaded image.")

    processed = preprocess_image(image)
    result    = predictor.predict(processed)
    return result


@app.get("/api/questions/{condition}")
def get_questions(condition: str):
    """
    Return adaptive symptom questions for a given condition code
    (e.g. mel, bcc, nv, akiec, bkl, df, vasc).
    """
    valid_codes = {"nv", "mel", "bkl", "bcc", "akiec", "vasc", "df"}
    if condition not in valid_codes:
        raise HTTPException(status_code=404, detail=f"Unknown condition code: {condition}")

    questions = get_questions_for_condition(condition)
    return {"condition": condition, "questions": questions}


@app.post("/api/refine")
def refine(request: RefinementRequest):
    """
    Apply rule-based refinement to initial predictions using
    the user's symptom questionnaire answers.
    """
    result = refine_prediction(
        initial_predictions=request.initial_predictions,
        top_condition=request.top_condition,
        answers=request.answers,
    )
    return result
