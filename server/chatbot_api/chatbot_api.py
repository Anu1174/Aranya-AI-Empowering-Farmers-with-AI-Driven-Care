from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from PIL import Image
import io

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# ==========================
# Load models
# ==========================
cnn_model = load_model(r"C:/Users/anugu/Desktop/Project/server/Chatbot_api/cattle_image_model.h5")
class_indices = joblib.load(r"C:/Users/anugu/Desktop/Project/server/Chatbot_api/class_indices.pkl")
index_to_label = {v: k for k, v in class_indices.items()}
clf = joblib.load(r"C:/Users/anugu/Desktop/Project/server/Chatbot_api/symptom_model.pkl")
vectorizer = joblib.load(r"C:/Users/anugu/Desktop/Project/server/Chatbot_api/vectorizer.pkl")
disease_df = pd.read_csv(r"C:/Users/anugu/Desktop/Project/server/Chatbot_api/animal_disease_dataset.csv")

readable_mapping = {'fmd': 'Foot and Mouth Disease', 'lumpyskin': 'Lumpy Skin Disease', 'mastitis': 'Mastitis'}

# ==========================
# Routes
# ==========================
@app.route('/chatbot/disease-info', methods=['POST'])
def get_disease_info():
    query = request.json.get("query", "").lower()
    matches = disease_df[disease_df['Disease'].str.lower().str.contains(query)]
    if matches.empty:
        return jsonify({"error": "No matching disease found"}), 404
    result = matches.iloc[0].to_dict()
    return jsonify(result)

@app.route('/chatbot/symptoms', methods=['POST'])
def predict_by_symptoms():
    text = request.json.get("symptoms", "")
    if not text:
        return jsonify({"error": "No symptoms provided"}), 400
    input_vec = vectorizer.transform([text])
    predicted_disease = clf.predict(input_vec)[0]
    match = disease_df[disease_df['Disease'].str.lower() == predicted_disease.lower()]
    if not match.empty:
        return jsonify(match.iloc[0].to_dict())
    return jsonify({"disease": predicted_disease, "info": "Not found in dataset"})

@app.route('/chatbot/image', methods=['POST'])
def predict_by_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    img = Image.open(io.BytesIO(file.read())).convert("RGB")

    # ✅ Auto-detect input shape expected by the CNN model
    try:
        input_shape = cnn_model.input_shape
        if len(input_shape) == 4:
            IMG_HEIGHT, IMG_WIDTH = input_shape[1], input_shape[2]
        else:
            IMG_HEIGHT, IMG_WIDTH = 150, 150
    except Exception:
        IMG_HEIGHT, IMG_WIDTH = 150, 150

    # ✅ Resize accordingly
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # 🧠 Predict disease
    prediction = cnn_model.predict(img_array)
    predicted_class_index = np.argmax(prediction)

    # ✅ Handle label lookup safely
    label = index_to_label.get(predicted_class_index, "unknown")
    disease_name = readable_mapping.get(label, "Unknown Disease")

    # 📋 Fetch info from dataset if available
    match = disease_df[disease_df['Disease'].str.lower().str.contains(disease_name.lower())]
    if not match.empty:
        info = match.iloc[0].to_dict()
        return jsonify({
            "Disease": info.get("Disease", disease_name),
            "Description": info.get("Description", "No description available."),
            "Solution": info.get("Solution", "No treatment info available.")
        })
    else:
        return jsonify({
            "Disease": disease_name,
            "Description": "Not found in dataset",
            "Solution": "Try uploading a clearer image."
        })

if __name__ == "__main__":
    app.run(port=5002, debug=True)
