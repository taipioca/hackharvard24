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
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

models = joblib.load('region_models.pkl')


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')


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
    model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-4")
    parser = StrOutputParser()
    
    # Define the prompt template
    template = """
    Is it a good time to invest in real estate in {region} based on historical price trends and current market conditions for the year {year}?
    Provide a detailed analysis and recommendation.
    """
    prompt = ChatPromptTemplate.from_template(template)
    
    chain = prompt | model | parser
    
    # Run the chain with the input variables
    try:
        result = chain.run({'region': region, 'year': year})
        return jsonify({'region': region, 'year': year, 'summary': result})
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
