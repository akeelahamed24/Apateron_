import React, { useState, useEffect } from 'react';
import './WithdrawPage.css'; // Make sure you have the corresponding CSS file
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const WithdrawPage = ({ loggedInUser }) => {
  const [amount, setAmount] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = loggedInUser.uid;
    
    firebase
      .database()
      .ref(`users/${userId}`)
      .once('value')
      .then((snapshot) => {
        setUserData(snapshot.val());
      })
      .catch((error) => {
        console.error('Fetch user data error:', error);
      });
  }, [loggedInUser]);

  const handleWithdraw = async () => {
    try {
      const userId = loggedInUser.uid;

      if (userData && parseInt(amount, 10) <= userData.balance) {
        const newBalance = userData.balance - parseInt(amount, 10);

        await firebase.database().ref(`users/${userId}/balance`).set(newBalance);
        
        // Update the userData state with the new balance
        setUserData((prevUserData) => ({
          ...prevUserData,
          balance: newBalance,
        }));

        alert('Withdraw successful');
        setAmount('');
      } else {
        alert('Insufficient balance for withdrawal.');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Withdraw failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="withdraw-container">
      <h2>Withdraw Page</h2>
      <label>Amount:</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <br />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
};

export default WithdrawPage;
