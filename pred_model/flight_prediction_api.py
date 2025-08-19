from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import pickle

app = Flask(__name__)
CORS(app)

# Load trained model and model columns
model = joblib.load('flight_delay_model.pkl')
model_columns = joblib.load('model_columns.pkl')

# Load precomputed airport distances
with open('airport_distances.pkl', 'rb') as f:
    airport_distances = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Extract basic info from frontend
        dep = data.get('dep')
        arr = data.get('arr')
        airline = data.get('AIRLINE')

        # Base numeric features
        features = {
            'DEP_HOUR': data.get('DEP_HOUR'),
            'DAY_OF_WEEK': data.get('DAY_OF_WEEK'),
            'MONTH': data.get('MONTH'),
            'DELAY_DUE_WEATHER': data.get('DELAY_DUE_WEATHER', 0),
            'DELAY_DUE_NAS': data.get('DELAY_DUE_NAS', 0),
            'DELAY_DUE_CARRIER': 0
        }

        # Distance lookup (default 0 if route not in dataset)
        features['DISTANCE'] = airport_distances.get((dep, arr), 0)

        # One-hot encode airline, origin, and destination
        features[f"AIRLINE_{airline}"] = 1
        features[f"ORIGIN_{dep}"] = 1
        features[f"DEST_{arr}"] = 1

        # Convert to DataFrame and ensure all model columns exist
        input_df = pd.DataFrame([features])
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        # Predict probability
        proba = model.predict_proba(input_df)[0][1]

        # Apply threshold
        optimal_threshold = 0.80
        prediction = int(proba >= optimal_threshold)

        return jsonify({
            'delay_probability': round(float(proba), 4),
            'prediction': prediction
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Flight Delay Prediction API is running.'})

if __name__ == '__main__':
    app.run(debug=True)
