from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import numpy as np
import joblib
import pandas as pd

from model import predict_image

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# -----------------------------
# APP INITIALIZATION
# -----------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -----------------------------
# LOAD AI MODELS
# -----------------------------

temp_model = joblib.load("save models/hybrid_model.pkl")

remedies = pd.read_excel(
    "herbal_data.xlsx",
    engine="openpyxl"
)

remedies["combined_text"] = (
    remedies["Disease"].astype(str) + " " +
    remedies["Severity"].astype(str) + " " +
    remedies["Temperament"].astype(str) + " " +
    remedies["Remedy/Precaution(1)"].astype(str) + " " +
    remedies["Remedy/Precaution(2)"].astype(str) + " " +
    remedies["Remedy/Precaution(3)"].astype(str)
)

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(remedies["combined_text"])


# -----------------------------
# IMAGE ANALYSIS API
# -----------------------------

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, image.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    pred_class = predict_image(file_path)

    if pred_class == "Normal":
        result = {
            "disease": "Normal",
            "severity": None,
            "layer": None,
            "info": "Skin looks healthy"
        }

    elif pred_class.startswith("Acne"):
        severity_map = {
            "Acne_Mild": "Mild",
            "Acne_Moderate": "Moderate",
            "Acne_Severe": "Severe"
        }

        severity = severity_map.get(pred_class, "Mild")

        if severity in ["Mild", "Moderate"]:
           layer = "Epidermis"
        else:
           layer = "Dermis"

        result = {
           "disease": "Acne",
           "severity": severity,
           "layer": layer,
           "info": "Acne detected"
    }

    elif pred_class.startswith("Eczema"):
        severity_map = {
           "Eczema_Mild": "Mild",
           "Eczema_Moderate": "Moderate",
           "Eczema_Severe": "Severe"
    }

        severity = severity_map.get(pred_class, "Mild")

        if severity in ["Mild", "Moderate"]:
           layer = "Epidermis"
        else:
           layer = "Dermis"

        result = {
           "disease": "Eczema",
           "severity": severity,
           "layer": layer,
           "info": "Eczema detected"
    }

    else:
        result = {
            "disease": "Other",
            "severity": None,
            "layer": None,
            "info": "Unknown condition"
        }

    try:
        os.remove(file_path)
    except:
        pass

    return result


# -----------------------------
# TEMPERAMENT PREDICTION API
# -----------------------------

from pydantic import BaseModel

class TempInput(BaseModel):
    bodyAppearance: int
    bodyFeel: int
    complexion: int
    pulse: int
    behavior: int
    thirst: int
    appetite: int
    sleep: int
    stool: int
    urine: int


@app.post("/predict-temperament")
def predict_temperament(data: TempInput):

    try:
        features = [[
            data.bodyAppearance,
            data.bodyFeel,
            data.complexion,
            data.pulse,
            data.behavior,
            data.thirst,
            data.appetite,
            data.sleep,
            data.stool,
            data.urine
        ]]

        features = np.array(features, dtype=np.float32)

        prediction = temp_model.predict(features)[0]

        return {"temperament": str(prediction)}

    except Exception as e:
        return {"error": str(e)}

# -----------------------------
# HERBAL RECOMMENDATION AI API
# -----------------------------

@app.post("/recommend")
def recommend(data: dict):

    disease = data.get("disease", "")
    severity = data.get("severity", "")
    temperament = data.get("temperament", "")

    filtered = remedies[
    (remedies["Disease"] == disease) &
    (remedies["Severity"] == severity) &
    (remedies["Temperament"].str.contains(temperament, case=False, na=False))
]

    if filtered.empty:
        return JSONResponse(content=[])

    user_profile = f"{severity} {temperament}"

    user_vector = vectorizer.transform([user_profile])

    similarity = cosine_similarity(
        user_vector,
        vectorizer.transform(filtered["combined_text"])
    )

    top_indices = similarity.argsort()[0][-3:][::-1]

    result = filtered.iloc[top_indices]

    return JSONResponse(
        content=result.to_dict(orient="records")
    )