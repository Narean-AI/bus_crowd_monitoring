import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';

interface NotificationSystemProps {
  notifications: string[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Array<{id: string, message: string, timestamp: Date}>>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const newNotification = {
        id: Date.now().toString(),
        message: latestNotification,
        timestamp: new Date()
      };
      
      setVisibleNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  }, [notifications]);

  const removeNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (message: string) => {
    if (message.includes('🚨') || message.includes('Critical')) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    if (message.includes('⚠️') || message.includes('Warning')) {
      return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    }
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getNotificationStyle = (message: string) => {
    if (message.includes('🚨') || message.includes('Critical')) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (message.includes('⚠️') || message.includes('Warning')) {
      return 'bg-orange-50 border-orange-200 text-orange-800';
    }
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg max-w-md transform transition-all duration-300 ${getNotificationStyle(notification.message)}`}
        >
          <div className="flex items-start space-x-3">
            {getNotificationIcon(notification.message)}
            <div className="flex-1">
              <div className="font-medium">
                {notification.message.replace(/[🚨⚠️📊]/g, '').trim()}
              </div>
              <div className="text-sm opacity-75 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;