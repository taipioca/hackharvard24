import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

df = pd.read_csv('input_df.csv')
df = df.dropna(subset=['Region', 'Year', 'Median Sale Price'])

models = {}
regions = df['Region'].unique()

for region in regions:
    region_data = df[df['Region'] == region]
    
    X = region_data[['Year']]
    y = region_data[['Median Sale Price']]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('year', 'passthrough', ['Year'])
        ])

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    model.fit(X, y)
    models[region] = model

joblib.dump(models, 'region_models.pkl')
