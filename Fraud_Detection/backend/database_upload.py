import csv
import json
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\jdurairaj\OneDrive - DXC Production\Documents\ClePro\HACKATHON\fraud_firebase(private key).json')
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Read CSV file and convert to JSON
csv_file = r'C:\Users\jdurairaj\Downloads\Fraud.csv'
json_data = []

with open(csv_file, mode='r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        json_data.append(row)

# Define Firestore collection name
collection_name = 'data_collection'

# Write JSON data to Firestore
for item in json_data:
    db.collection(collection_name).add(item)

print('Data uploaded to Firestore successfully.')

