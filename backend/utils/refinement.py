"""
Adaptive Questioning + Rule-Based Refinement Engine

Each question has a `weight` dict: {condition_code: delta_probability}
Answer values: 0 = No, 1 = Unsure/Maybe, 2 = Yes
Multipliers:   0 → -0.5×weight  |  1 → +0.3×weight  |  2 → +1.0×weight
"""

from typing import Dict, List

# ─────────────────────────────────────────────────────
# Condition-specific questions
# ─────────────────────────────────────────────────────
CONDITION_QUESTIONS: Dict[str, List[dict]] = {
    "mel": [
        {
            "id":   "mel_1",
            "text": "Has the lesion changed in size, shape, or color in recent months?",
            "hint": "Evolving lesions are a key melanoma warning sign.",
            "weight": {"mel": 0.16, "nv": -0.08},
        },
        {
            "id":   "mel_2",
            "text": "Does the lesion have irregular, ragged, or notched borders?",
            "hint": "Asymmetric or uneven borders are concerning.",
            "weight": {"mel": 0.14, "nv": -0.06},
        },
        {
            "id":   "mel_3",
            "text": "Does it contain multiple colors — brown, black, red, white, or blue?",
            "hint": "Multiple colors within one lesion increase melanoma risk.",
            "weight": {"mel": 0.14},
        },
        {
            "id":   "mel_4",
            "text": "Is the lesion larger than ~6 mm (the size of a pencil eraser)?",
            "hint": "Larger diameter is part of the ABCDE criteria.",
            "weight": {"mel": 0.10, "bcc": 0.04},
        },
        {
            "id":   "mel_5",
            "text": "Does the lesion bleed or ooze without being scratched or injured?",
            "hint": "Spontaneous bleeding may indicate malignancy.",
            "weight": {"mel": 0.10, "bcc": 0.06},
        },
    ],
    "nv": [
        {
            "id":   "nv_1",
            "text": "Has this mole been present for many years without noticeable changes?",
            "hint": "Stable, long-standing moles are usually benign.",
            "weight": {"nv": 0.14, "mel": -0.10},
        },
        {
            "id":   "nv_2",
            "text": "Is the mole roughly symmetrical — one half mirrors the other?",
            "hint": "Symmetry is reassuring for benign nevi.",
            "weight": {"nv": 0.12, "mel": -0.08},
        },
        {
            "id":   "nv_3",
            "text": "Do you have many similar-looking moles elsewhere on your body?",
            "hint": "Multiple similar moles often indicate common benign nevi.",
            "weight": {"nv": 0.08},
        },
        {
            "id":   "nv_4",
            "text": "Is the color uniform — a single consistent shade of tan or brown?",
            "hint": "Uniform color supports a benign diagnosis.",
            "weight": {"nv": 0.10, "mel": -0.06},
        },
    ],
    "bcc": [
        {
            "id":   "bcc_1",
            "text": "Does the lesion appear pearly, shiny, or translucent with visible blood vessels?",
            "hint": "Pearly or waxy appearance is a hallmark of BCC.",
            "weight": {"bcc": 0.16},
        },
        {
            "id":   "bcc_2",
            "text": "Is there a central depression, ulceration, or sore that won't heal?",
            "hint": "Ulcerated BCCs are common on the face and scalp.",
            "weight": {"bcc": 0.14, "mel": 0.04},
        },
        {
            "id":   "bcc_3",
            "text": "Is it located on a sun-exposed area (face, scalp, neck, hands)?",
            "hint": "UV-exposed skin is the most common BCC location.",
            "weight": {"bcc": 0.08, "akiec": 0.06},
        },
        {
            "id":   "bcc_4",
            "text": "Has the area been bleeding intermittently without fully healing?",
            "hint": "Recurring bleeding is a common BCC symptom.",
            "weight": {"bcc": 0.12, "mel": 0.04},
        },
    ],
    "akiec": [
        {
            "id":   "ak_1",
            "text": "Does the patch feel rough, scaly, or sandpaper-like to the touch?",
            "hint": "Rough texture is the most distinctive AK feature.",
            "weight": {"akiec": 0.16},
        },
        {
            "id":   "ak_2",
            "text": "Have you had significant cumulative sun exposure over the years?",
            "hint": "Chronic sun exposure is the primary AK risk factor.",
            "weight": {"akiec": 0.12, "bcc": 0.05},
        },
        {
            "id":   "ak_3",
            "text": "Is it a flat or slightly raised patch, pink-red, skin-coloured, or brownish?",
            "hint": "Flat, rough patches on sun-damaged skin suggest AK.",
            "weight": {"akiec": 0.10},
        },
        {
            "id":   "ak_4",
            "text": "Does it sometimes itch, burn, or feel tender — especially in sunlight?",
            "hint": "Discomfort with UV exposure is common in AK.",
            "weight": {"akiec": 0.08},
        },
    ],
    "bkl": [
        {
            "id":   "bkl_1",
            "text": "Does the lesion have a waxy, stuck-on appearance, like a barnacle on the skin?",
            "hint": "This classic appearance is almost diagnostic for seborrheic keratosis.",
            "weight": {"bkl": 0.18, "mel": -0.06},
        },
        {
            "id":   "bkl_2",
            "text": "Does it have a rough, warty, crumbly, or grainy surface?",
            "hint": "Keratinous surface texture strongly suggests BKL.",
            "weight": {"bkl": 0.14},
        },
        {
            "id":   "bkl_3",
            "text": "Is the color uniformly tan, brown, or dark brown throughout?",
            "hint": "Uniform coloration in a rough lesion supports BKL.",
            "weight": {"bkl": 0.08},
        },
    ],
    "df": [
        {
            "id":   "df_1",
            "text": "Is the lesion a firm, hard nodule that feels firmly attached beneath the skin?",
            "hint": "Firm, tethered nodules are classic for dermatofibroma.",
            "weight": {"df": 0.16},
        },
        {
            "id":   "df_2",
            "text": "When you gently pinch the lesion, does the skin dimple inward?",
            "hint": "The 'dimple sign' is highly specific to dermatofibroma.",
            "weight": {"df": 0.20},
        },
        {
            "id":   "df_3",
            "text": "Is it brownish-red, located on the lower leg, and possibly related to a prior insect bite?",
            "hint": "DF often follows minor trauma and appears on lower limbs.",
            "weight": {"df": 0.10},
        },
    ],
    "vasc": [
        {
            "id":   "vasc_1",
            "text": "Is the lesion distinctly red, purple, or blue in colour?",
            "hint": "Vascular lesions get their color from blood vessels.",
            "weight": {"vasc": 0.16},
        },
        {
            "id":   "vasc_2",
            "text": "Does pressing on it cause the color to lighten or disappear (blanching)?",
            "hint": "Blanching on pressure strongly indicates a vascular lesion.",
            "weight": {"vasc": 0.18},
        },
        {
            "id":   "vasc_3",
            "text": "Is it soft, compressible, or does it pulsate slightly?",
            "hint": "Compressibility suggests a blood-filled or vascular origin.",
            "weight": {"vasc": 0.10},
        },
    ],
}

# General questions appended after condition-specific ones
GENERAL_QUESTIONS: List[dict] = [
    {
        "id":   "gen_1",
        "text": "Does the lesion itch, burn, or cause persistent discomfort?",
        "hint": "Persistent symptoms warrant professional evaluation.",
        "weight": {"mel": 0.05, "bcc": 0.05, "akiec": 0.07},
    },
    {
        "id":   "gen_2",
        "text": "Have you had significant sun exposure or used tanning beds historically?",
        "hint": "UV history increases risk for multiple skin cancers.",
        "weight": {"mel": 0.06, "bcc": 0.06, "akiec": 0.08},
    },
    {
        "id":   "gen_3",
        "text": "Do you have a personal or family history of skin cancer?",
        "hint": "Genetic and prior history significantly elevate risk.",
        "weight": {"mel": 0.08, "bcc": 0.06, "akiec": 0.05},
    },
]

# ─────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────
def get_questions_for_condition(condition: str) -> List[dict]:
    specific = CONDITION_QUESTIONS.get(condition, [])
    return specific + GENERAL_QUESTIONS


def refine_prediction(
    initial_predictions: Dict[str, float],
    top_condition: str,
    answers: Dict[str, int],
) -> dict:
    """
    Apply rule-based score adjustments based on user symptom answers.

    answers : {question_id: 0|1|2}  (0=No, 1=Unsure, 2=Yes)
    """
    scores = {k: v for k, v in initial_predictions.items()}

    answer_multiplier = {0: -0.5, 1: 0.3, 2: 1.0}
    all_questions = get_questions_for_condition(top_condition)

    for q in all_questions:
        q_id = q["id"]
        if q_id not in answers or "weight" not in q:
            continue
        mult = answer_multiplier.get(answers[q_id], 0)
        for code, delta in q["weight"].items():
            if code in scores:
                scores[code] = max(0.0, scores[code] + delta * mult)

    # Renormalize
    total = sum(scores.values())
    if total > 0:
        scores = {k: v / total for k, v in scores.items()}

    RISK = {"nv": "low", "mel": "high", "bkl": "low", "bcc": "high",
            "akiec": "medium", "vasc": "low", "df": "low"}
    NAMES = {
        "nv":    "Melanocytic Nevi",
        "mel":   "Melanoma",
        "bkl":   "Benign Keratosis-like Lesions",
        "bcc":   "Basal Cell Carcinoma",
        "akiec": "Actinic Keratoses / Intraepithelial Carcinoma",
        "vasc":  "Vascular Lesions",
        "df":    "Dermatofibroma",
    }
    DESCRIPTIONS = {
        "nv":    "Common benign moles. Monitor for ABCDE changes.",
        "mel":   "Most dangerous skin cancer. Requires immediate evaluation.",
        "bkl":   "Non-cancerous growth with a waxy, stuck-on appearance.",
        "bcc":   "Most common skin cancer; rarely spreads but causes local damage.",
        "akiec": "Precancerous rough patches from sun damage; may become cancerous.",
        "vasc":  "Benign blood vessel lesions; sudden changes need evaluation.",
        "df":    "Benign firm skin nodule, often on the lower leg.",
    }

    top_code = max(scores, key=scores.get)
    confidence = scores[top_code]

    sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top3 = [
        {"code": k, "name": NAMES.get(k, k), "probability": v,
         "risk": RISK.get(k, "unknown"), "description": DESCRIPTIONS.get(k, "")}
        for k, v in sorted_items[:3]
    ]

    return {
        "refined_predictions": {
            code: {
                "name":        NAMES.get(code, code),
                "probability": prob,
                "risk":        RISK.get(code, "unknown"),
                "description": DESCRIPTIONS.get(code, ""),
            }
            for code, prob in scores.items()
        },
        "top3":               top3,
        "top_condition":      top_code,
        "top_condition_name": NAMES.get(top_code, top_code),
        "confidence":         confidence,
        "risk_level":         RISK.get(top_code, "unknown"),
        "description":        DESCRIPTIONS.get(top_code, ""),
    }
