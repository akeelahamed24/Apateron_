import React, { useEffect, useState } from 'react';
import './BankDetailsPage.css'; // Import the CSS for this page if needed
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const BankDetailsPage = ({ loggedInUser }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      const userId = loggedInUser.uid;
    
      firebase
        .database()
        .ref(`users/${userId}`)
        .once('value')
        .then((snapshot) => {
          const userSnapshot = snapshot.val();
          if (userSnapshot) {
            setUserData(userSnapshot);
          }
        })
        .catch((error) => {
          console.error('Fetch user data error:', error);
        });
    }
  }, [loggedInUser]);

  return (
    <div className="bank-details-container">
      <h2>Bank Details</h2>
      {userData ? (
        <>
          <p>User ID: {loggedInUser.uid}</p>
          <p>Minimum Balance: Rs. {userData.balance || 0}</p>
          <p>Date of Birth: {userData.dob || 'Not provided'}</p>
          <p>Email: {loggedInUser.email}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default BankDetailsPage;
