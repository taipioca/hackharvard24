import joblib
import pandas as pd
import sqlite3
import numpy as np  # Import NumPy for generating random noise

# Load the models
models = joblib.load('region_models.pkl')

def predict(region, year):
    if region in models:
        model = models[region]
        
        # Prepare the input for prediction
        input_data = pd.DataFrame({'Year': [year], 'Region': [region]})
        
        # Predict using the model
        prediction = model.predict(input_data)
        return prediction[0]  # Return the first prediction
    else:
        raise ValueError("Region not found", region)

def add_noise(price, noise_level=0.05):
    """Add random noise to the price."""
    noise = price * np.random.uniform(-noise_level, noise_level)  # Noise within ±5% of the price
    return price + noise

def predict_average_median_sale_price(start_year=2024, end_year=2035):
    # Assume regions is a list of all regions in your database
    regions = ["Eugene, OR",
               "Boulder, CO",
               "Fort Collins, CO",
               "Cedar Rapids, IA",
               "Madison, WI",
               "Asheville, NC"]
    
    predictions = []

    for region in regions:
        for year in range(start_year, end_year + 1):
            average_price = predict(region, year)[0]
            noisy_price = add_noise(average_price)  # Add noise to the predicted price
            predictions.append({
                'Year': year,
                'Region': region,
                'Average Median Sale Price': noisy_price
            })

    # Create a DataFrame from the predictions
    predictions_df = pd.DataFrame(predictions)

    # Save the DataFrame to a CSV file
    csv_file = 'predicted_median_sale_prices.csv'
    predictions_df.to_csv(csv_file, index=False)
    print(f"Predictions saved to {csv_file}")

    return csv_file

def insert_data_from_csv(csv_file):
    conn = sqlite3.connect('data.sqlite')
    cursor = conn.cursor()
    
    data = pd.read_csv(csv_file)

    for index, row in data.iterrows():
        average_price = row['Average Median Sale Price']
        if pd.notna(average_price):
            cursor.execute('''INSERT INTO my_table (Year, Region, Average_Median_Sale_Price)
                              VALUES (?, ?, ?)''', 
                           (row['Year'], row['Region'], average_price))

    conn.commit()
    conn.close()

# Example usage
csv_file = predict_average_median_sale_price()
insert_data_from_csv(csv_file)
