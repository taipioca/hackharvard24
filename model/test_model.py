import joblib
import pandas as pd

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

predicted_values = predict('Miami, FL', 2023)
print("Predictions for Median Sale Price and Median Sale to List Ratio:", predicted_values)
