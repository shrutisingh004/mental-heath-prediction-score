# Rhythm : Student Mental Health Score Predictor

A machine learning web app that predicts a student's mental health score (0-10) from their social media habits, sleep, study, and lifestyle patterns. FastAPI backend, vanilla JS frontend, no frameworks.


## Overview

Rhythm takes a student's daily habits : screen time, sleep, study hours, physical activity, stress level, and platform usage - and returns a predicted mental health score from a model trained on real survey data. The frontend visualizes how those hours add up across a 24-hour day before the person even submits, then shows the prediction on a simple gauge.

## Tech stack

| Layer | Tools |
|---|---|
| Backend | FastAPI, scikit-learn, pandas, joblib |
| Frontend | HTML, CSS, vanilla JavaScript |
| Model training | Jupyter, pandas, seaborn/matplotlib, scikit-learn |
| Model hosting | Hugging Face Hub |

No React, no Vue, no build step - the frontend runs as static files.

## Project structure

```
project/
├── backend/
│   ├── main.py              # FastAPI app + /predict endpoint
│   ├── requirements.txt
│   └── mental-health-model.pkl
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── model/
│   ├── training.ipynb        # EDA, cleaning, and model training
│   └── Student Social Media And Mental Health Impact.csv
├── .gitignore
└── README.md
```


## API reference

### `POST /predict`

**Request body**

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

| Field | Type | Notes |
|---|---|---|
| `age` | int | 10–100 |
| `gender` | string | `Male`, `Female` |
| `country` | string | any value accepted; grouped server-side as "Other" if outside the model's top countries |
| `academic_level` | string | `High School`, `Undergraduate`, `Graduate` |
| `most_used_platform` | string | one of 12 supported platforms |
| `purpose_of_use` | string | `Networking`, `Education`, `Entertainment`, `News` |
| `avg_daily_usage_hours` | float | 0–24 |
| `daily_unlocks` | int | ≥ 0 |
| `study_hours` | float | 0–24 |
| `physical_activity_hours` | float | 0–24 |
| `sleep_hours_per_night` | float | 0–24 |
| `stress_level` | string | `Low`, `Medium`, `High`, `Very High` |

Invalid input returns `422 Unprocessable Entity` with FastAPI's standard validation error detail.

## Disclaimer

This is a statistical estimate from a machine learning model trained on survey data, not a clinical or diagnostic tool. If you're concerned about your mental health, please talk to a counselor, doctor, or someone you trust.
