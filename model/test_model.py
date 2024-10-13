import joblib
import pandas as pd

# models = joblib.load('region_models.pkl')

# def predict(region, year):
#     if region in models:
#         model = models[region]
#         input_data = pd.DataFrame({'Year': [year], 'Region': [region]})
#         prediction = model.predict(input_data)
#         return prediction
#     else:
#         raise ValueError("Region not found.")

# predicted_values = predict('Miami, FL', 2023)
# print("Predictions for Median Sale Price and Median Sale to List Ratio:", predicted_values)
from datasets import load_dataset
import numpy as np
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import statsmodels.api as sm

region = 'San Antonio, TX'

input_df = dataset_dict['sales']['train'].to_pandas()

# Convert list to dictionary with values as indices
my_dict = {value: index for index, value in enumerate(input_df['Date'].unique())}
input_df['time'] = input_df['Date'].map(my_dict)

input_df['Year'] = input_df['Date'].astype(str).str.slice(0, 4).astype(int)
input_df['Month'] = input_df['Date'].astype(str).str.slice(5, 7).astype(int)
input_df['Day'] = input_df['Date'].astype(str).str.slice(8, 10).astype(int)

input_df

df = input_df[(input_df['Region Type'] == 3) &
              (input_df['Region'] == region) &
              (input_df['Home Type'] == 2)][['Date', 'Median Sale Price']]

df['Log Median Sale Price'] = df['Median Sale Price'].apply(np.log)
df['Date'] = pd.to_datetime(df['Date'])
df = df.set_index(['Date'])
df = df.dropna()

plt.figure(figsize=(15,7))
plt.title("Log Median Sale Price in " + region)
plt.xlabel('Date')
plt.ylabel('Log Median Sale Price')
plt.plot(df['Log Median Sale Price'])
plt.show()