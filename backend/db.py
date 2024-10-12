import sqlite3
import pandas as pd

def create_database():
    conn = sqlite3.connect('data.sqlite')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS my_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Year INT,
        Region TEXT,
        Average_Median_Sale_Price REAL
    )
    ''')
    
    conn.commit()
    conn.close()

create_database()

def insert_data_from_csv(csv_file):
    conn = sqlite3.connect('data.sqlite')
    cursor = conn.cursor()
    
    data = pd.read_csv(csv_file)

    for index, row in data.iterrows():
        average_price = row['Average Median Sale Price']
        if pd.notna(average_price):
            cursor.execute('''
            INSERT INTO my_table (Year, Region, Average_Median_Sale_Price)
            VALUES (?, ?, ?)
            ''', (row['Year'], row['Region'], average_price))

    conn.commit()
    conn.close()

insert_data_from_csv('averaged_df.csv')
