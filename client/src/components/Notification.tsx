import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
}

const bgColors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-[#ff5500]',
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose,
  actions,
}) => (
  <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColors[type]} text-white px-6 py-4 rounded shadow-lg z-50 transition flex flex-col items-center min-w-[260px]`}>
    <div className="flex items-center justify-between w-full">
      <span>{message}</span>
      {onClose && (
        <button
          className="ml-4 text-white text-xl leading-none hover:opacity-70"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
    {actions && actions.length > 0 && (
      <div className="flex gap-2 mt-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded ${
              action.variant === 'secondary'
                ? 'bg-gray-700 hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default Notification;