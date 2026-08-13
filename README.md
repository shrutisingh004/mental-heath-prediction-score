<h1 align="center">Rhythm</h1>
<p align="center"><strong>Predict a student's mental health score from their daily digital habits.</strong></p>

<p align="center">
  <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-backend-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"></a>
  <a href="https://scikit-learn.org"><img src="https://img.shields.io/badge/scikit--learn-model-F7931E?style=flat-square&logo=scikit-learn&logoColor=white" alt="scikit-learn"></a>
  <a href="https://huggingface.co/shrutisingh004/mental-health-model"><img src="https://img.shields.io/badge/HuggingFace-model-FFD21E?style=flat-square&logo=huggingface&logoColor=black" alt="Hugging Face"></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Render-deployed-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render"></a>
</p>

<p align="center">
  <a href="https://mental-heath-score.onrender.com"><img src="https://img.shields.io/badge/Live%20Demo-mental--heath--score.onrender.com-3F6C63?style=for-the-badge" alt="Live Demo"></a>
</p>

---

## What It Does

Rhythm is a machine learning app that scores a student's mental health on a 0 to 10 scale, based on daily habits: screen time, sleep, study, physical activity, and self reported stress. As you fill in the form, a live dial shows how those hours add up across a 24 hour day, so you see the shape of your routine before you even see the prediction.

## How It Works

```
Form input (age, sleep, screen time, study, activity, stress...)
        │
        ▼
FastAPI /predict endpoint
        │
        ▼
scikit-learn model  ←  trained on 700+ student survey responses
        │
        ▼
Predicted mental health score (0-10)
```

| Component | Technology |
|---|---|
| Backend | FastAPI |
| Model | scikit-learn, trained in a Jupyter notebook |
| Model hosting | Hugging Face Hub |
| Frontend | HTML, CSS, vanilla JavaScript |
| Deployment | Render |

## Project Structure

```
mental-heath-prediction-score/
│
├── backend/
│   ├── main.py               # FastAPI app, /predict endpoint, serves frontend/
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model/
│   ├── training.ipynb         # EDA, cleaning, and model training
│   └── Student Social Media And Mental Health Impact.csv
│
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.10 or higher

### Installation

**1. Clone the repository**

```
git clone https://github.com/shrutisingh004/mental-heath-prediction-score.git
cd mental-heath-prediction-score/backend
```

**2. Install dependencies**

```
pip install -r requirements.txt
```

**3. Run the app**

```
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`. The model downloads automatically from Hugging Face on startup, and the frontend is served from the same address, so there's nothing else to run.

## Usage

1. Fill in your age, gender, country, and academic level
2. Add your daily habits: screen time, phone unlocks, study hours, physical activity, sleep, and stress level
3. Watch the dial fill in as you type, showing how your day adds up
4. Hit **Predict my score** and see your result on the gauge

## API Reference

**`POST /predict`**

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.5,
  "daily_unlocks": 60,
  "study_hours": 3,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

**Response** `200 OK`

```json
{ "predicted_mental_health_score": 6.42 }
```

Full docs with interactive testing at `/docs` on either the local or live app.

## Deployment

Deployed on Render as a single web service. FastAPI serves the frontend directly, so both live at one URL: [mental-heath-score.onrender.com](https://mental-heath-score.onrender.com)

## Disclaimer

This is a statistical estimate from a model trained on survey data, not a clinical or diagnostic tool. If you're concerned about your mental health, please talk to a counselor, doctor, or someone you trust.

---

<p align="center"><em>Built with FastAPI · scikit-learn · Hugging Face · vanilla JS</em></p>
