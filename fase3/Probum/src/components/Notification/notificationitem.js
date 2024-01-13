import React from 'react';
import './NotificationCard.css'; 

const NotificationItem = ({ title,message }) => {
    return (
      <div className="message-notification-card">
        <p style={{ fontWeight: 'bold' }}>{title}</p>
        <p>{message}</p>
      </div>
    );
};

export default NotificationItem;