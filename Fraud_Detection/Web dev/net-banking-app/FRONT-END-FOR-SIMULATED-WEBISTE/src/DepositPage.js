import React, { useState } from 'react';
import './DepositPage.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const DepositPage = ({ loggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      // Authenticate the user with their provided email and password
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const userId = loggedInUser.uid;

      // Fetch the user's current balance from the database
      const snapshot = await firebase.database().ref(`users/${userId}/balance`).once('value');
      const currentBalance = snapshot.val();

      // Calculate the new balance after deposit
      const newBalance = currentBalance + parseInt(amount, 10);

      // Update the user's balance in the database
      await firebase.database().ref(`users/${userId}/balance`).set(newBalance);

      // Show success message with updated balance
      alert(`Deposit successful. Your new balance is: ${newBalance}`);

      // Clear input fields
      setEmail('');
      setPassword('');
      setAmount('');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="deposit-container">
      <h2>Deposit Page</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {/* ... Other input fields */}
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
};

export default DepositPage;
