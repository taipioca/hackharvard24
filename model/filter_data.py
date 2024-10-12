import pandas as pd

df = pd.read_csv('input_df.csv')

grouped_df = df.groupby(['Year', 'Region']).agg({
    'Median Sale Price': 'mean',
    'Median Sale to List Ratio': 'mean'
}).reset_index()

grouped_df.rename(columns={
    'Median Sale Price': 'Average Median Sale Price',
    'Median Sale to List Ratio': 'Average Median Sale to List Ratio'
}, inplace=True)

grouped_df.to_csv('averaged_df.csv', index=False)
