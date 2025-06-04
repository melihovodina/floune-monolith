import React from 'react';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#ff5500] text-white px-4 py-2 rounded shadow-lg z-50 transition">
    {message}
  </div>
);

export default Notification;