import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import cryptoRandomString from 'crypto-random-string';
import BankDetailsPage from './BankDetailsPage';
import WithdrawPage from './WithdrawPage';
import DepositPage from './DepositPage';

const firebaseConfig = {
  apiKey: "AIzaSyCIavCSH4Lpi308aSsG9eFIgRNQXjkspGU",
  authDomain: "log-in-sign-up-e38dc.firebaseapp.com",
  databaseURL: "https://log-in-sign-up-e38dc-default-rtdb.firebaseio.com",
  projectId: "log-in-sign-up-e38dc",
  storageBucket: "log-in-sign-up-e38dc.appspot.com",
  messagingSenderId: "225386246376",
  appId: "1:225386246376:web:452609e144f9ca36bad95d"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [page, setPage] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(''); // State for Date of Birth
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

   const handleSignup = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
      const userId = cryptoRandomString({ length: 16, type: 'alphanumeric' });

      await firebase.database().ref(`users/${userId}`).set({
        displayName: name,
        email,
        dob,
        balance: 0, // Initialize balance to 0
      });

      await currentUser.updateProfile({ displayName: name });
      setLoggedInUser(currentUser);
      setPage('login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email address is already in use by another account.');
      } else {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again later.');
      }
    }
  };
  
  


  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoggedInUser(firebase.auth().currentUser);
      setPage('welcome');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      setLoggedInUser(null);
      setPage('signup');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Net Banking App</h1>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              loggedInUser ? (
                <HomeLoggedIn loggedInUser={loggedInUser} handleLogout={handleLogout} />
              ) : (
                <HomeLoggedOut
                  page={page}
                  setPage={setPage}
                  setName={setName}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  setDob={setDob}
                  handleSignup={handleSignup}
                  handleLogin={handleLogin}
                />
              )
            }
          />
          <Route path="/bank-details" element={<BankDetailsPage loggedInUser={loggedInUser} />} />
          <Route path="/withdraw" element={<WithdrawPage loggedInUser={loggedInUser} />} />
          <Route path="/deposit" element={<DepositPage loggedInUser={loggedInUser} />} />
        </Routes>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <p>User ID: {loggedInUser.uid}</p>
              <p>Minimum Balance: Rs. 20,000</p>
              <p>Date of Birth: {dob}</p>
              <p>Email: {loggedInUser.email}</p>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

const HomeLoggedIn = ({ loggedInUser, handleLogout }) => {
  return (
    <div className="welcome-container">
      <h2>
        Welcome,{' '}
        <span className="user-name">
          {loggedInUser.displayName}
        </span>
        !
      </h2>
      <div className="action-buttons">
        <Link to="/withdraw">
          <button>Withdraw</button>
        </Link>
        <Link to="/bank-details">
          <button>Check Bank Details</button>
        </Link>
        <Link to="/deposit">
          <button>Deposit</button>
        </Link>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

const HomeLoggedOut = ({
  page,
  setPage,
  setName,
  setEmail,
  setPassword,
  setDob,
  handleSignup,
  handleLogin,
}) => {
  return (
    <div className="auth-container">
      {page === 'signup' && (
        <div className="auth-form">
          <h2>Sign Up</h2>
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <input type="date" placeholder="Date of Birth" onChange={(e) => setDob(e.target.value)} />
          <button onClick={handleSignup}>Sign Up</button>
          <p onClick={() => setPage('login')}>Already have an account? Log in</p>
        </div>
      )}
      {page === 'login' && (
        <div className="auth-form">
          <h2>Login</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Log In</button>
          <p onClick={() => setPage('signup')}>Don't have an account? Sign up</p>
        </div>
      )}
    </div>
  );
};

export default App;