import sqlite3

# Path to your SQLite file
db_path = 'data.sqlite'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Specify the table and column you want to extract data from
table_name = 'my_table'  # Replace with the name of the table containing the 'Region' column
column_name = 'Region'

# Query to get all unique entries from the specified column
cursor.execute(f"SELECT DISTINCT {column_name} FROM {table_name};")
rows = cursor.fetchall()

# Save the unique entries to a text file
with open("region_entries.txt", "w") as file:
    for row in rows:
        file.write(f"{row[0]}\n")  # Each row is a tuple, and we only need the first item (the column entry)

# Close the connection
conn.close()

print("Unique region entries have been saved to region_entries.txt")
