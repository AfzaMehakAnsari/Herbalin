from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from model import predict_image

app = FastAPI()

# CORS setup: allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, image.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    pred_class = predict_image(file_path)  # e.g., "Acne_Mild"

    # Map class to structured info
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
        result = {
            "disease": "Acne",
            "severity": severity_map[pred_class],
            "layer": "Epidermis",
            "info": "Acne detected on skin"
        }
    elif pred_class.startswith("Eczema"):
        severity_map = {
            "Eczema_Mild": "Mild",
            "Eczema_Moderate": "Moderate",
            "Eczema_Severe": "Severe"
        }
        result = {
            "disease": "Eczema",
            "severity": severity_map[pred_class],
            "layer": "Dermis",
            "info": "Eczema detected on skin"
        }
    else:
        result = {
            "disease": "Xyz",
            "severity": None,
            "layer": None,
            "info": "Other skin condition detected"
        }

    # Optional: delete uploaded file
    try:
        os.remove(file_path)
    except:
        pass

    return result

