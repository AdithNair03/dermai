\# 🩺 DermAI — Adaptive Multimodal Skin Symptom Analysis



<div align="center">



\[!\[Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge\&logo=vercel)](https://dermai-beige.vercel.app)

\[!\[Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge\&logo=render)](https://dermai-backend-jrje.onrender.com)

\[!\[Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge\&logo=python)](https://python.org)

\[!\[React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react)](https://reactjs.org)

\[!\[TensorFlow](https://img.shields.io/badge/TensorFlow-2.13-FF6F00?style=for-the-badge\&logo=tensorflow)](https://tensorflow.org)

\[!\[License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)



\*\*An AI-powered skin condition analysis system that combines deep learning image classification with adaptive symptom-based questioning — mimicking real dermatologist reasoning.\*\*



\[🌐 Live App](https://dermai-beige.vercel.app) · \[📡 API Docs](https://dermai-backend-jrje.onrender.com/docs) · \[🐛 Report Bug](https://github.com/AdithNair03/dermai/issues)



</div>



\---



\## 📌 Table of Contents



\- \[About the Project](#-about-the-project)

\- \[Key Features](#-key-features)

\- \[System Architecture](#-system-architecture)

\- \[Tech Stack](#-tech-stack)

\- \[Dataset](#-dataset)

\- \[Model Details](#-model-details)

\- \[Performance Results](#-performance-results)

\- \[API Endpoints](#-api-endpoints)

\- \[Getting Started](#-getting-started)

\- \[Project Structure](#-project-structure)

\- \[Team](#-team)

\- \[Acknowledgements](#-acknowledgements)



\---



\## 🔬 About the Project



DermAI is a full-stack AI-powered web application for preliminary skin condition awareness. Unlike conventional image-only classifiers, DermAI includes a \*\*confidence-aware adaptive questioning system\*\* — when the model is uncertain, it asks the user targeted clinical questions (just like a dermatologist would) and uses those answers to refine its prediction.



\### The Problem



Most AI skin analysis tools:

\- Return a prediction regardless of how confident the model actually is

\- Rely exclusively on image data, ignoring symptom context

\- Cannot handle ambiguous or low-quality images gracefully



\### Our Solution



DermAI addresses this by:

\- Evaluating \*\*prediction confidence\*\* before returning any result

\- Triggering an \*\*adaptive Q\&A module\*\* for uncertain predictions

\- \*\*Fusing image evidence with symptom answers\*\* via a weighted rule engine

\- Providing \*\*risk level\*\*, \*\*preventive measures\*\*, and a \*\*safety disclaimer\*\* with every output



> ⚠️ \*\*Disclaimer:\*\* DermAI is for educational and awareness purposes only. It is not a substitute for professional medical diagnosis. Always consult a qualified dermatologist.



\---



\## ✨ Key Features



| Feature | Description |

|---|---|

| 🖼️ \*\*Image Upload\*\* | Drag-and-drop or click-to-upload skin lesion images |

| 🤖 \*\*AI Classification\*\* | EfficientNetB0 trained on HAM10000 — 7 condition classes |

| 🔒 \*\*Confidence Gate\*\* | Predictions below 0.65 confidence automatically trigger Q\&A |

| 💬 \*\*Adaptive Q\&A\*\* | 30+ condition-specific clinical questions asked interactively |

| 🔀 \*\*Multimodal Fusion\*\* | Symptom answers mathematically shift image-based scores |

| 📊 \*\*Results Dashboard\*\* | Confidence ring, probability bars, risk badge, preventive measures |

| 🔐 \*\*Authentication\*\* | Login / Signup with protected routes |

| 📱 \*\*Responsive UI\*\* | Dark theme — works on desktop and mobile |

| ☁️ \*\*Full Deployment\*\* | Live frontend (Vercel) + backend (Render) with GitHub auto-deploy |



\---



\## 🏗️ System Architecture



```

User uploads skin image

&#x20;         │

&#x20;         ▼

┌─────────────────────────┐

│     React Frontend      │  ← Vercel (dermai-beige.vercel.app)

│   React 18 + Vite +     │

│      Tailwind CSS        │

└──────────┬──────────────┘

&#x20;          │  POST /api/predict

&#x20;          ▼

┌─────────────────────────┐

│    FastAPI Backend       │  ← Render (Singapore, free tier)

│    Python 3.11           │

└──────────┬──────────────┘

&#x20;          │

&#x20;          ▼

┌─────────────────────────┐

│   EfficientNetB0 Model  │

│   Focal Loss trained    │

│   HAM10000 dataset      │

└──────────┬──────────────┘

&#x20;          │

&#x20;          ▼

&#x20;    Confidence C = max(P)

&#x20;     /               \\

&#x20; C ≥ 0.65           C < 0.65

&#x20;    │                   │

&#x20;    ▼                   ▼

&#x20;Show Result        Adaptive Q\&A

&#x20;Directly           (30+ questions)

&#x20;                        │

&#x20;                        ▼

&#x20;                 Refinement Engine

&#x20;            S\_final\[k] = p\_k + Σ(w\_jk × μ\_j)

&#x20;                        │

&#x20;                        ▼

&#x20;                 Refined Result

&#x20;                        │

&#x20;                        ▼

&#x20;             Results Dashboard

&#x20;   (Condition · Confidence · Risk · Measures)

```



\---



\## 🛠️ Tech Stack



\### Frontend

\- \*\*React 18\*\* — UI framework

\- \*\*Vite\*\* — Build tool and dev server

\- \*\*Tailwind CSS\*\* — Utility-first styling

\- \*\*React Router DOM\*\* — Client-side routing

\- \*\*Axios\*\* — HTTP client



\### Backend

\- \*\*FastAPI\*\* — REST API framework

\- \*\*Uvicorn\*\* — ASGI server

\- \*\*Python 3.11\*\* — Runtime

\- \*\*python-multipart\*\* — Image file handling

\- \*\*Pydantic\*\* — Data validation



\### Machine Learning

\- \*\*TensorFlow 2.13\*\* (CPU) — Deep learning framework

\- \*\*EfficientNetB0\*\* — CNN backbone (ImageNet pretrained)

\- \*\*Focal Loss\*\* — Custom loss function (γ=2.0, α=0.25)

\- \*\*NumPy\*\* — Array and matrix operations

\- \*\*Pillow\*\* — Image loading and preprocessing

\- \*\*scikit-learn\*\* — Evaluation metrics and stratified splitting



\### Deployment \& DevOps

\- \*\*Vercel\*\* — Frontend hosting with GitHub auto-deploy

\- \*\*Render\*\* — Backend hosting (Singapore, free tier)

\- \*\*GitHub\*\* — Version control + CI/CD trigger

\- \*\*Google Colab T4\*\* — Model training environment



\---



\## 📦 Dataset



\*\*HAM10000\*\* — Human Against Machine with 10,000 Training Images  

\*(Tschandl et al., Scientific Data, 2018)\*



| Class | Condition | Original Samples | Risk Level |

|---|---|---|---|

| `nv` | Melanocytic Nevi | 6,705 | 🟢 Low |

| `mel` | Melanoma | 1,113 | 🔴 High |

| `bkl` | Benign Keratosis-like Lesions | 1,099 | 🟢 Low |

| `bcc` | Basal Cell Carcinoma | 514 | 🔴 High |

| `akiec` | Actinic Keratoses | 327 | 🟡 Medium |

| `vasc` | Vascular Lesions | 142 | 🟢 Low |

| `df` | Dermatofibroma | 115 | 🟢 Low |



\*\*Class imbalance handling:\*\*

\- Balanced oversampling → \*\*1,200 samples per class\*\* (8,400 total)

\- \*\*Focal Loss\*\* to concentrate gradient on hard minority-class samples



\---



\## 🧠 Model Details



\### Architecture



```

Input Image (224 × 224 × 3)

&#x20;          ↓

EfficientNetB0 Backbone

(ImageNet pretrained — compound scaling)

&#x20;          ↓

Global Average Pooling

&#x20;          ↓

Batch Normalization

&#x20;          ↓

Dropout (0.4)

&#x20;          ↓

Dense (512 neurons, ReLU)

&#x20;          ↓

Batch Normalization

&#x20;          ↓

Dropout (0.3)

&#x20;          ↓

Dense (256 neurons, ReLU)

&#x20;          ↓

Dropout (0.2)

&#x20;          ↓

Softmax (7 classes)

P = \[p₁, p₂, p₃, p₄, p₅, p₆, p₇]

```



\### Two-Phase Training Strategy



| Phase | Epochs | Backbone | Learning Rate | Purpose |

|---|---|---|---|---|

| Phase 1 | 15 | ❄️ Frozen | 1 × 10⁻³ | Train classification head |

| Phase 2 | 25 | 🔥 Top-40 unfrozen | 2 × 10⁻⁶ | Fine-tune to skin domain |



\### Focal Loss



```

FL = -α × (1 - p\_t)^γ × log(p\_t)

γ = 2.0   α = 0.25

```



\### Multimodal Refinement Formula



```

S\_final\[k] = p\_k + Σ(w\_jk × μ\_j)



w\_jk = clinical weight of question j for class k

μ\_j  = response multiplier

&#x20;       Yes    =  1.0

&#x20;       Unsure =  0.3

&#x20;       No     = -0.5



Scores renormalised to sum to 1 after adjustment.

```



\---



\## 📊 Performance Results



\### Model Comparison



| Model | Accuracy | Precision | Recall | F1-Score |

|---|---|---|---|---|

| CNN-only Baseline | 0.634 | 0.621 | 0.608 | 0.614 |

| EfficientNetB0 + Focal Loss | 0.678 | 0.665 | 0.652 | 0.658 |

| \*\*Proposed Multimodal System\*\* | \*\*0.921\*\* | \*\*0.831\*\* | \*\*0.819\*\* | \*\*0.825\*\* |



\### Comparison with State-of-the-Art



| Study | Architecture | Accuracy | Approach |

|---|---|---|---|

| Kassem et al. (2021) | MobileNetV2 | 0.882 | Image only |

| Thurnhofer et al. (2021) | DenseNet169 | 0.836 | Image only |

| Naim et al. (2022) | EfficientNetB3 + Attention | 0.913 | Image only |

| Brinker et al. (2019) | ResNet50 | 0.825 | Image only |

| Codella et al. (2018) | Ensemble CNN | 0.854 | Image only |

| \*\*Proposed (2026)\*\* | \*\*EfficientNetB0 + Q\&A\*\* | \*\*0.921\*\* | \*\*Image + Symptoms ✓\*\* |



\### System Performance



| Metric | Target | Achieved |

|---|---|---|

| Prediction Response Time | < 500 ms | 312 ms avg |

| Frontend Load Time | < 3 s | 1.8 s |

| Model Loading Time | < 15 s | 8.4 s |

| Memory Usage | < 512 MB | \~480 MB |

| Q\&A Refinement Improvement | ≥ 5% | +24.3% |



\---



\## 🔌 API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| `GET` | `/health` | Health check |

| `POST` | `/api/predict` | Upload image → prediction + confidence |

| `GET` | `/api/questions/{condition}` | Condition-specific Q\&A questions |

| `POST` | `/api/refine` | Submit answers → refined prediction |



📖 \*\*Interactive docs:\*\* https://dermai-backend-jrje.onrender.com/docs



\---



\## 🚀 Getting Started



\### Prerequisites

\- Python 3.11

\- Node.js 18+

\- Git



\### 1. Clone the repo

```bash

git clone https://github.com/AdithNair03/dermai.git

cd dermai

```



\### 2. Backend setup

```bash

\# Windows

E:

cd skin\_ai\_project\\backend

python -m venv skin\_env

skin\_env\\Scripts\\activate

pip install -r requirements.txt



\# Start backend

uvicorn main:app --reload --port 8000

```



Wait for:

```

\[Predictor] Model ready.

INFO: Application startup complete.

```



\### 3. Frontend setup

```bash

cd frontend

npm install

npm run dev

```



\### 4. Open in browser

```

http://localhost:5173

```



\### Demo Credentials



| Username | Password |

|---|---|

| `demo` | `demo123` |

| `adith` | `dermai123` |

| `kevin` | `dermai123` |



> ⚠️ The trained model file (`efficientnet\_skin.h5`) is not included due to file size. Contact the team or retrain using the Colab notebook.



\---



\## 📁 Project Structure



```

dermai/

├── backend/

│   ├── main.py                    # FastAPI app, CORS, routes

│   ├── requirements.txt           # Python dependencies

│   ├── .python-version            # Pinned to 3.11.0

│   └── model/

│       ├── predict.py             # EfficientNetB0 + FocalLoss loader

│       ├── questions.py           # 30+ condition-specific questions

│       ├── refinement.py          # Weighted score fusion engine

│       └── efficientnet\_skin.h5   # Trained model (not in repo)

│

├── frontend/

│   ├── src/

│   │   ├── pages/

│   │   │   ├── Home.jsx           # Landing page

│   │   │   ├── Analysis.jsx       # Main analysis workflow

│   │   │   ├── Login.jsx          # Login page

│   │   │   └── Signup.jsx         # Signup page

│   │   ├── components/

│   │   │   ├── Navbar.jsx         # Navigation + logout

│   │   │   ├── ImageUpload.jsx    # Drag-drop upload zone

│   │   │   ├── QuestionModal.jsx  # Adaptive Q\&A interface

│   │   │   ├── ResultsDashboard.jsx # Results + charts

│   │   │   └── LoadingState.jsx

│   │   ├── hooks/

│   │   │   └── useSkinAnalysis.js # Core state + API logic

│   │   └── App.jsx                # Routes + PrivateRoute guard

│   ├── vite.config.js             # /api proxy to backend

│   └── package.json

│

├── render.yaml                    # Render deployment config

└── README.md

```



\---



\## 👥 Team



| Name | Role | Contact |

|---|---|---|

| \*\*Adith Nair\*\* | ML Model · Backend · Refinement Engine | adithnair369@gmail.com |

| \*\*Kevin John Manoj\*\* | Frontend · Q\&A Module · Deployment | kevin03.manoj@gmail.com |



\*\*Guide:\*\* Dr. A. Robert Singh

Department of Computational Intelligence

SRM Institute of Science and Technology, Kattankulatham



\---



\## 🙏 Acknowledgements



\- \[HAM10000 Dataset](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DBW86T) — Tschandl et al., 2018

\- \[EfficientNet Paper](https://arxiv.org/abs/1905.11946) — Tan \& Le, ICML 2019

\- \[Focal Loss Paper](https://arxiv.org/abs/1708.02002) — Lin et al., ICCV 2017

\- SRM Institute of Science and Technology, Kattankulatham



\---



<div align="center">



Made with ❤️ by \*\*Adith Nair\*\* \& \*\*Kevin John Manoj\*\* · SRM IST · 2026



</div>



