'use client'

import React, { useRef, useEffect } from 'react';
import { X, Bell, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

interface Notification {
  id: number
  type: string
  message: string
  time: string
}

interface NotificationsPaneProp {
  notifications: Notification[]
  onClose: () => void
}

const NotificationsPane = ({ notifications, onClose }: NotificationsPaneProp) => {
  const paneRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paneRef.current && event.target instanceof Element && !paneRef.current.contains(event.target)) {
        // Check if the click is on the notifications button - don't close if it is
        const notificationsButton = event.target.closest('[data-notifications-button]');
        if (!notificationsButton) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <AlertCircle size={18} className="text-blue-500" />;
      case 'market':
        return <TrendingUp size={18} className="text-green-500" />;
      case 'reminder':
        return <Calendar size={18} className="text-yellow-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'weather':
        return 'border-l-blue-500';
      case 'market':
        return 'border-l-green-500';
      case 'reminder':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <>
      {/* Mobile backdrop blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden" />
      
      {/* Notifications Pane */}
      <div 
        ref={paneRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200
                   md:absolute md:right-4 md:top-20 md:w-96
                   inset-4 md:inset-auto
                   max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-l-4 transition-colors cursor-pointer ${getNotificationBorderColor(notification.type)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{notification.time}</p>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        notification.type === 'weather' ? 'bg-blue-100 text-blue-700' :
                        notification.type === 'market' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Mark All Read
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              View All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPane;
