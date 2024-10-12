from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json
import logging
import os
import joblib
import pandas as pd
from dotenv import load_dotenv
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

models = joblib.load('region_models.pkl')

def predict(region, year):
    if region in models:
        model = models[region]
        
        # Prepare the input for prediction
        input_data = pd.DataFrame({'Year': [year], 'Region': [region]})
        
        # Predict using the model
        prediction = model.predict(input_data)
        return prediction
    else:
        raise ValueError("Region not found.")

@app.route("/")
def home():
    return "Welcome to TerraP!"

@app.route('/predict_price', methods=['GET'])
def predict_price():
    data = json.loads(request.data)
    region = data.get('region')
    year = data.get('year')
    try:
        predicted_values = predict(region, year)
        if predicted_values:
            return jsonify({'median_price': predicted_values[0], 'median_list_to_sale': predicted_values[1]})
        else:
            return make_response('Server error', 500)

    except Exception as e:
        logger.error('Error retrieving response: %s', str(e))
        return make_response(f"An error occurred while retrieving response: {str(e)}", 500)
    
@app.route('/price_over_time', methods=['GET'])
# labels, value (list)
def price_over_time():
    pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)
