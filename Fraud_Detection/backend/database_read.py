import csv
import json
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\jdurairaj\OneDrive - DXC Production\Documents\ClePro\HACKATHON\fraud_firebase(private key).json')
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

user_ref = db.collection('users').document('IdlUtBVz3ONNMcNaxFneWf32rms2')
user = user_ref.get()
print(user.to_dict())
user_ref.update({'flag_accuracy' : '98.01'})

user = user_ref.get()
print(user.to_dict())
