import pandas as pd
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv() # Load variables from .env if present

file_path = r"C:\Users\Adianto\Downloads\PSAK31JAN26.xlsx"
output_path = "server/data.json"

# Supabase config (optional)
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

try:
    df = pd.read_excel(file_path)
    # Convert dates to ISO string
    for col in df.select_dtypes(include=['datetime64']).columns:
        df[col] = df[col].dt.strftime('%Y-%m-%d')
        
    # Save local json
    df.to_json(output_path, orient='records')
    print(f"Data saved to {output_path} with {len(df)} records.")

    # Upload to Supabase if config is present
    if url and key:
        supabase: Client = create_client(url, key)
        # Upload as a file to Storage
        with open(output_path, 'rb') as f:
            file_name = f"backups/data_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.json"
            supabase.storage.from_('excel-uploads').upload(file_name, f)
            print(f"Data uploaded to Supabase Storage as {file_name}")
            
except Exception as e:
    print(f"Error: {e}")
