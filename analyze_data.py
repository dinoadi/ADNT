import pandas as pd
import json

file_path = r"C:\Users\Adianto\Downloads\PSAK31JAN26.xlsx"
output_path = "server/data.json"

try:
    df = pd.read_excel(file_path)
    # Convert dates to ISO string
    for col in df.select_dtypes(include=['datetime64']).columns:
        df[col] = df[col].dt.strftime('%Y-%m-%d')
        
    df.to_json(output_path, orient='records')
    print(f"Data saved to {output_path} with {len(df)} records.")
except Exception as e:
    print(f"Error: {e}")
