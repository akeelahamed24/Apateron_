import pandas as pd
from flask import Flask,request
from joblib import parallel_backend,load,dump
import xgboost as xgb
import lightgbm as lgbm
from sklearn.model_selection import StratifiedKFold,GridSearchCV
from sklearn.metrics import accuracy_score,roc_auc_score,precision_score
import schedule
import threading,time
import csv,json
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\jdurairaj\OneDrive - DXC Production\Documents\ClePro\HACKATHON\fraud_firebase(private key).json')
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

app = Flask(__name__)

df = pd.read_csv(r'C:\Users\jdurairaj\Downloads\Fraud.csv')
df['type'] = df['type'].map({'PAYMENT':0, 'CASH_IN':1, 'DEBIT':2, 'CASH_OUT':3, 'TRANSFER':4})
Features = ['step','type','amount']

Target = 'isFraud'

X = df[Features]
Y = df[Target]

xgb_param = {'booster':['gbtree','gblinear'],'n_estimators':[10,32,64,100]}
lgbm_param = {'n_estimators':[10,32,64,100]}
model_metricXGB = {'acc_score':99.906,'hypar':{'booster':'gbtree','n_estimators':32}}
model_metricLGBM = {'acc_score':99.883,'hypar':{'n_estimators':32}}

def check_for_best():
  model = xgb.XGBClassifier()
  gscv = GridSearchCV(esitmator=model,n_jobs=-1,param_grid=xgb_param,scoring='accuracy',cv=5)
  gscv.fit(X,Y)
  best_model = gscv.best_estimator_
  model_metricXGB['acc_score'] = best_model.get_score_
  model_metricXGB['hypar'] = best_model.get_params
  dump(best_model,'best_modelXGboost.joblib')

  model = lgbm.LGBMClassifier()
  gscv = GridSearchCV(estimator=model,n_jobs=-1,param_grid=lgbm_param,scoring='accuracy',cv=5)
  gscv.fit(X,Y)
  best_model = gscv.best_estimator_
  model_metricXGB['acc_score'] = best_model.get_score_
  model_metricXGB['hypar'] = best_model.get_params
  dump(best_model,'best_modellgbm.joblib')

schedule.every().day.at('12:00').do(check_for_best)

def run_scheduled_tasks():
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.route('/predict',methods=['POST'])
def fraud_detection():

  model = load(r'C:\Users\jdurairaj\OneDrive - DXC Production\Documents\ClePro\HACKATHON\Fraud_Detection\backend\best_modelXGboost.joblib')
  pred = model.predict(X[Features].sample(20))
  return {'predicted':pred.tolist(),'accuracy':model_metricXGB['acc_score'],'hyperparameters':model_metricXGB['hypar']}
  
@app.route('/quickpredict',methods=['POST'])
def quick_predict():
  
  user_ref = db.collection('users').document('IdlUtBVz3ONNMcNaxFneWf32rms2')
  model = load(r'C:\Users\jdurairaj\OneDrive - DXC Production\Documents\ClePro\HACKATHON\Fraud_Detection\backend\best_modellgbm.joblib')
  pred = model.predict(X[Features].sample(20)) 
  user_ref.update({'flag_accuracy' : str(model_metricLGBM['acc_score'])})
  return {'predicted':pred.tolist(),'accuracy':model_metricLGBM['acc_score'],'hyperparameters':model_metricLGBM['hypar']}

if __name__ == '__main__':
  
    # Start the Flask app in a separate thread
    flask_thread = threading.Thread(target=app.run, kwargs={"host": "0.0.0.0", "port": 5000})
    flask_thread.start()
    
    # Start the scheduled tasks in the main thread
    run_scheduled_tasks()