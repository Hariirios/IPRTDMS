// Notification store for admin notifications
export interface Notification {
  id: string;
  type: 'deletion_request' | 'requisition' | 'project' | 'student' | 'attendance' | 'team' | 'general';
  title: string;
  message: string;
  relatedId?: string; // ID of related item (e.g., deletion request ID)
  isRead: boolean;
  createdAt: string;
  createdBy: string;
}

// In-memory store (in real app, this would be in database)
let notifications: Notification[] = [];

export const notificationStore = {
  getAll: () => notifications,
  
  getUnread: () => notifications.filter(n => !n.isRead),
  
  getUnreadCount: () => notifications.filter(n => !n.isRead).length,
  
  getById: (id: string) => notifications.find(n => n.id === id),
  
  add: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    notifications.unshift(newNotification); // Add to beginning
    return newNotification;
  },
  
  markAsRead: (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  },
  
  markAllAsRead: () => {
    notifications.forEach(n => n.isRead = true);
  },
  
  delete: (id: string) => {
    notifications = notifications.filter(n => n.id !== id);
  },
  
  deleteAll: () => {
    notifications = [];
  }
};
