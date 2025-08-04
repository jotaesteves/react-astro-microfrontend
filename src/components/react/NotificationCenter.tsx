import React, { useState, useEffect } from "react";
import { fetchNotifications } from "../../lib/api";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  userId?: number;
  maxNotifications?: number;
}

export default function NotificationCenter({ userId = 1, maxNotifications = 5 }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetchNotifications(userId, maxNotifications);

        if (response.status === "success") {
          const notificationsData = response.data.map((n) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifications(notificationsData);
          setUnreadCount(notificationsData.filter((n) => !n.read).length);
        } else {
          setError("Failed to load notifications");
        }
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId, maxNotifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="notification-container bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-4/5 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-container bg-white rounded-lg shadow-md p-4">
        <div className="text-center py-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-container bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-blue-600 text-sm hover:text-blue-800">
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? "bg-blue-25" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full border ${getNotificationColor(notification.type)}`}>
                  <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium text-gray-900 ${!notification.read ? "font-semibold" : ""}`}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  {notification.actionUrl && (
                    <button className="text-blue-600 text-xs mt-2 hover:text-blue-800">View Details →</button>
                  )}
                </div>
                {!notification.read && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-blue-600 text-sm hover:text-blue-800">View All Notifications</button>
      </div>
    </div>
  );
}
