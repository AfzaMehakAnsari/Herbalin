#  Herbalin – AI-Powered Skin Disease Detection & Herbal Recommendation System
<img width="947" height="418" alt="image" src="https://github.com/user-attachments/assets/225c0c8d-c1e9-4d5f-a68e-ae54fea18666" />

##  Overview

**Herbalin** is a web-based intelligent healthcare platform designed to detect common skin diseases and provide **personalized herbal treatment recommendations**. It combines **Artificial Intelligence (AI)**, **Computer Vision**, and **Natural Language Processing (NLP)** with traditional herbal medicine practices to deliver accessible, safe, and effective skincare guidance.

The system aims to bridge the gap between **modern AI diagnostics** and **traditional herbal healing**, offering users an affordable alternative to costly dermatological consultations and unreliable online advice.

---

##  Problem Statement

Skin-related issues such as acne and eczema affect a large portion of the population. However, existing solutions have limitations:

* Expensive dermatologist consultations
* Overuse of chemical-based treatments
* Lack of trustworthy, personalized online guidance
* Limited integration of traditional herbal knowledge with modern technology

**Herbalin addresses these challenges** by providing an intelligent, data-driven, and user-centric solution.

---

##  Key Features
<img width="1569" height="711" alt="image" src="https://github.com/user-attachments/assets/dfb376b1-ae61-4f24-b904-8195d8cf5377" />

###  AI-Based Skin Disease Detection

* Upload skin images for analysis
* Deep learning model classifies:

  * Acne
  * Eczema
  * Normal skin
* Determines **severity level**:

  * Mild
  * Moderate
  * Severe
* Identifies **affected skin layer**:

  * Epidermis
  * Dermis
<img width="692" height="405" alt="image" src="https://github.com/user-attachments/assets/7b1c1d73-ddc4-4e22-9efd-0fa5c6f78c02" />

---

###  Personalized Herbal Recommendations

* Temperament-based assessment (questionnaire)
<img width="708" height="421" alt="image" src="https://github.com/user-attachments/assets/4619a69c-0ffd-420c-ac93-e6fe1713da3a" />

* Customized:

  * Herbal remedies
  * Dietary suggestions
* Inspired by traditional herbal medicine principles
<img width="670" height="416" alt="image" src="https://github.com/user-attachments/assets/d2fdf926-d609-46c7-9f09-65da81059a7d" />

---

###  Automated Report Generation

* Generates detailed **PDF reports** including:

  * Diagnosis
  * Severity level
  * Skin layer analysis
  * Recommended treatments
<img width="331" height="370" alt="image" src="https://github.com/user-attachments/assets/9d55075c-ca54-4030-994f-46f0186756bd" />

---

###  Scan History Management

* Stores previous scans
* Allows users to track progress over time
<img width="947" height="418" alt="image" src="https://github.com/user-attachments/assets/3c626b90-f84b-4353-921c-885673cae7b1" />

---

###  Appointment Booking

* Book consultations with a **certified herbalist**
* Integrated scheduling system
<img width="608" height="412" alt="image" src="https://github.com/user-attachments/assets/e356a822-fe19-431b-8d19-658b61feb545" />

---

###  AI Chatbot

* Answers skin-related queries
* Provides instant guidance and recommendations
<img width="920" height="420" alt="image" src="https://github.com/user-attachments/assets/bf181909-c8d6-4af3-92af-94642bd20711" />

---

###  Blog & Educational Content

* Skincare tips
* Herbal remedies
* Awareness articles
<img width="713" height="416" alt="image" src="https://github.com/user-attachments/assets/7e17f84b-95ea-4e35-9383-fc23383cbb97" />

---

###  Review System

* Users can provide feedback
* Helps improve platform reliability
<img width="731" height="331" alt="image" src="https://github.com/user-attachments/assets/13a7b7cb-13dd-4eca-9f7f-73ccf782fee6" />

---

###  Admin Panel

* Manage users
* Control content (blogs, reviews, etc.)
* Monitor system activity
<img width="1600" height="742" alt="image" src="https://github.com/user-attachments/assets/b2ab8900-2daa-4c78-958f-6f3bae73f456" />

---

##  Research & Innovation Aspect

Herbalin is not just a development project—it integrates **research-driven methodologies**:

###  Deep Learning for Medical Imaging

* Uses **EfficientNet architecture** for high-accuracy image classification
* Optimized for:

  * Better performance with fewer parameters
  * Improved generalization on skin datasets

###  Computer Vision Techniques

* Image preprocessing using **OpenCV**
* Feature extraction for accurate disease detection

###  Explainable Insights

* Provides meaningful outputs:

  * Disease type
  * Severity
  * Skin layer involvement
* Helps users understand their condition, not just detect it

###  Hybrid Healthcare Approach

* Combines:

  * AI-based diagnosis
  * Traditional herbal medicine knowledge
* A novel approach rarely explored in existing systems

###  Personalization through NLP

* Questionnaire-based temperament analysis
* Generates **user-specific recommendations** instead of generic advice

---

##  System Architecture

**Frontend → Backend → AI Model → Database**

1. User uploads image via React frontend
2. Request sent to backend (Node.js / FastAPI)
3. Image processed using AI model
4. Results stored in MongoDB
5. Recommendations generated and displayed

---

##  Tech Stack

###  Frontend

* React.js
* Tailwind CSS

###  Backend

* Node.js
* Express.js
* Python FastAPI
* .NET Core

###  Database

* MongoDB

###  AI/ML

* Python
* TensorFlow
* EfficientNet
* OpenCV

---

##  Project Structure (Simplified)

```
Herbalin/
│── frontend/        # React UI
│── backend/         # Node.js / Express APIs
│── ai-model/        # ML model & FastAPI
│── database/        # MongoDB schemas
│── reports/         # Generated PDFs
│── docs/            # Documentation
```

---

##  Installation & Setup

###  Clone Repository

```bash
git clone https://github.com/AfzaMehakAnsari/Herbalin.git
cd Herbalin
```

###  Install Dependencies

```bash
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

###  Run Project

```bash
# frontend
npm start

# backend
npm run dev

# AI model (FastAPI)
uvicorn main:app --reload
```

---

##  Future Enhancements

* Support for more skin diseases
* Mobile application version
* Real-time dermatologist consultation
* Improved dataset for higher accuracy
* Integration with wearable health devices

---

## 🎓 Academic Context

This project is developed as a **Final Year Project (FYP)** for the **Department of Software Engineering, Bahria University Karachi Campus**, in collaboration with a certified herbalist.

---

##  Contribution

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

