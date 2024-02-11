import React from 'react';

const Welcome = ({ user, handleLogout }) => {
  return (
    <div className="welcome-container">
      <h2 className="welcome-message">Welcome to ABC Bank, <span className="user-name">{user.displayName}</span>!</h2>
      <div className="action-buttons">
        <button className="action-button">Withdraw</button>
        <button className="action-button">Check Bank Details</button>
        <button className="action-button">Deposit</button>
      </div>
      <p onClick={handleLogout}>Log Out</p>
    </div>
  );
};

export default Welcome;