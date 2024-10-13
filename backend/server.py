from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json
import logging
import joblib
import pandas as pd
import sqlite3
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import numpy as np 

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

models = joblib.load('region_models.pkl')


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('user_input')
    
    if not user_input:
        return jsonify({"error": "User input is required."}), 400
    
    # Get OpenAI API key from environment variable
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        logger.error('OpenAI API key not found.')
        return jsonify({"error": "OpenAI API key not found."}), 500
    
    # Initialize the ChatOpenAI model
    model = ChatOpenAI(
        openai_api_key=OPENAI_API_KEY,
        model_name="gpt-4o-mini",
        temperature=0.7,
        max_tokens=500
    )
    
    # Define a prompt template that sets the context to real estate investments
    template = """
You are a real estate investment expert. Provide detailed, accurate, and insightful information about real estate investments, market trends, and price predictions.

User Question: "{user_input}"

Your Response:
"""
    prompt = ChatPromptTemplate.from_template(template)
    
    # Create the chain
    chain = prompt | model | StrOutputParser()
    
    # Run the chain with the user input
    try:
        response = chain.invoke({'user_input': user_input})
        return jsonify({"response": response})
    except Exception as e:
        logger.error('Error generating response: %s', str(e))
        return jsonify({"error": str(e)}), 500


# Function to load regions from a file
def load_regions(file_path='../public/region_entries.txt'):
    try:
        with open(file_path, 'r') as file:
            regions = [line.strip() for line in file.readlines()]
        return regions
    except Exception as e:
        logger.error(f"Error loading regions from {file_path}: {str(e)}")
        return []

# Function to match the closest region and extract year using ChatOpenAI
def extract_region_and_year(input_text, regions_list):
    # Get OpenAI API key from environment variable
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        logger.error('OpenAI API key not found.')
        raise ValueError("OpenAI API key not found.")

    # Initialize the ChatOpenAI model
    model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-4o-mini", temperature=0.7, max_tokens=100)
    parser = StrOutputParser()
    
    # Convert regions_list to a string
    regions_string = '\n'.join(regions_list)

    # Define the prompt template with escaped braces
    template = """
Given the input inquiry and the appended list of possible cities/states, output the following JSON in the exact format below:
{{
    "region": "(Closest matching region from the list, with the city and state with 2-letter abbreviation)",
    "year": "(Year in four digits)"
}}

Do not give any cities and states that are not in the appended list. If you are unsure, make the best guess and fill out all fields in the exact format described. Do not output any other text or information other than the JSON.

Here is the list of possible regions:
{regions}

Input text: '{input_text}'
"""

    # Create the prompt
    prompt = ChatPromptTemplate.from_template(template)

    # Create the chain
    chain = prompt | model | parser

    # Run the chain with the input variables
    try:
        result = chain.invoke({'input_text': input_text, 'regions': regions_string})
        # Parse the result as JSON
        parsed_result = json.loads(result)
        return parsed_result
    except Exception as e:
        logger.error(f"Error extracting region and year: {str(e)}")
        raise ValueError(f"An error occurred while processing: {str(e)}")

# Flask endpoint to extract features
@app.route('/extract', methods=['POST'])
def extract_features():
    data = request.json
    input_text = data.get('user_input')
    if not input_text:
        return jsonify({"error": "Input text is required"}), 400

    regions_list = load_regions()
    if not regions_list:
        return jsonify({"error": "Failed to load regions list"}), 500
    
    # Extract closest region and year
    try:
        processed_output = extract_region_and_year(input_text, regions_list)
        return jsonify({"result": processed_output})
    except ValueError as e:
        return jsonify({"error": str(e)}), 500

# Function for making predictions (the definition might vary based on your model)
def predict(region, year):
    if region in models:
        model = models[region]
        
        # Prepare the input for prediction
        input_data = pd.DataFrame({'Year': [year], 'Region': [region]})
        
        # Predict using the model
        prediction = model.predict(input_data)
        return prediction
    else:
        raise ValueError(f"No model found for region: {region}")


@app.route("/")
def home():
    return "Welcome to TerraP!"

@app.route('/ai_summary', methods=['POST'])
def ai_summary():
    data = request.json
    region = data.get('region')
    year = data.get('year')
    
    if not region or not year:
        return make_response("Region and year are required.", 400)
    
    # Get OpenAI API key from environment variable
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    if not OPENAI_API_KEY:
        logger.error('OpenAI API key not found.')
        return make_response("OpenAI API key not found.", 500)
    
    # Initialize the ChatOpenAI model
    try:
        prediction = predict(region, year)
        # Handle if prediction is a list or array
        if isinstance(prediction, (list, np.ndarray)):
            predicted_value = prediction[0]
        else:
            predicted_value = prediction
        # Convert predicted_value to a native Python float
        if isinstance(predicted_value, np.ndarray):
            predicted_value = predicted_value.item()
        else:
            predicted_value = float(predicted_value)
    except Exception as e:
        logger.error('Error getting prediction: %s', str(e))
        return make_response(f"An error occurred while getting the prediction: {str(e)}", 500)
    
    # Initialize the ChatOpenAI model
    model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-4o-mini", temperature=0.7, max_tokens=500)
    parser = StrOutputParser()
    
    # Define the prompt template
    template = """
    Analyze the real estate market in {region} for the year {year}.
    The predicted average median sale price is ${predicted_value:,.2f}.
    Consider factors such as historical price trends, current market conditions, and development projects.
    Assume that cities with significant development and growth are good opportunities for investment.
    Provide a summary of your analysis based on the predicted sale price.
    **Provide a concise summary of your analysis in 5 sentences.**
    """
    prompt = ChatPromptTemplate.from_template(template)
    
    # Create the chain
    chain = prompt | model | parser
    
    # Run the chain with the input variables
    try:
        result = chain.invoke({'region': region, 'year': year, 'predicted_value': predicted_value})
        return jsonify({'region': region, 'year': year, 'predicted_value': predicted_value, 'summary': result})
    except Exception as e:
        logger.error('Error generating AI summary: %s', str(e))
        return make_response(f"An error occurred while generating the summary: {str(e)}", 500)
    

# @app.route('/ai_summary', methods=['POST'])
# def ai_summary():
#     data = request.json
#     region = data.get('region')
#     year = data.get('year')
    
#     # Prepare the prompt for the AI model
#     prompt = f"Provide a market analysis and recommendation for buying property in {region} for the year {year}."
    
#     # Generate the AI summary
#     try:
#         result = chat_model.invoke(prompt)
#         recommendation = result.get('text', 'No recommendation provided.')
#         return jsonify({'region': region, 'year': year, 'recommendation': recommendation})
#     except Exception as e:
#         return make_response(f"An error occurred while generating the summary: {str(e)}", 500)

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
    data = json.loads(request.data)
    region = data.get('region')
    year = data.get('year')
    conn = sqlite3.connect('data.sqlite')
    cursor = conn.cursor()

    try:
        cursor.execute('''
        SELECT Year, Average_Median_Sale_Price
        FROM my_table
        WHERE Region = ? AND Year = ?
        ''', (region, year))
        results = cursor.fetchall()
        years = [row[0] for row in results]
        prices = [row[1] for row in results]
        conn.close()
        if years and prices:
            return jsonify({'years': years, 'prices': prices})
        else:
            return make_response(f"No data found for region '{region}' in year '{year}'", 404)
        
    except Exception as e:
        logger.error('Error retrieving prices over time: %s', str(e))
        return make_response(f"An error occurred while retrieving prices: {str(e)}", 500)
    
@app.route('/dump_data', methods=['GET'])
def dump_data():
    conn = sqlite3.connect('data.sqlite')
    cursor = conn.cursor()

    try:
        cursor.execute('''
        SELECT Year, Region, Average_Median_Sale_Price
        FROM my_table
        ''')
        results = cursor.fetchall()
        conn.close()
        data_dict = {}
        for year, region, price in results:
            if year not in data_dict:
                data_dict[year] = {}
            data_dict[year][region] = price
        return jsonify(data_dict)
        
    except Exception as e:
        logger.error('Error retrieving data: %s', str(e))
        return make_response(f"An error occurred while retrieving data: {str(e)}", 500)

if __name__ == '__main__':
    app.run(debug=True, port=5000)