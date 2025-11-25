import { supabase } from './supabase';

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
  targetUser?: string; // Email of target user (admin or specific member)
}

export const notificationStore = {
  getAll: async (targetUser?: string) => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by target user if provided
      if (targetUser) {
        query = query.or(`target_user.eq.${targetUser},target_user.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(n => ({
        id: n.id,
        type: n.type as Notification['type'],
        title: n.title,
        message: n.message,
        relatedId: n.related_id,
        isRead: n.is_read,
        createdAt: n.created_at,
        createdBy: n.created_by,
        targetUser: n.target_user
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  getUnread: async (targetUser?: string) => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      // Filter by target user if provided
      if (targetUser) {
        query = query.or(`target_user.eq.${targetUser},target_user.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(n => ({
        id: n.id,
        type: n.type as Notification['type'],
        title: n.title,
        message: n.message,
        relatedId: n.related_id,
        isRead: n.is_read,
        createdAt: n.created_at,
        createdBy: n.created_by,
        targetUser: n.target_user
      }));
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },
  
  getUnreadCount: async (targetUser?: string) => {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      // Filter by target user if provided
      if (targetUser) {
        query = query.or(`target_user.eq.${targetUser},target_user.is.null`);
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        type: data.type as Notification['type'],
        title: data.title,
        message: data.message,
        relatedId: data.related_id,
        isRead: data.is_read,
        createdAt: data.created_at,
        createdBy: data.created_by
      };
    } catch (error) {
      console.error('Error fetching notification:', error);
      return null;
    }
  },
  
  add: async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          related_id: notification.relatedId,
          is_read: false,
          created_by: notification.createdBy,
          target_user: notification.targetUser || 'admin'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type as Notification['type'],
        title: data.title,
        message: data.message,
        relatedId: data.related_id,
        isRead: data.is_read,
        createdAt: data.created_at,
        createdBy: data.created_by
      };
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  },
  
  markAsRead: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type as Notification['type'],
        title: data.title,
        message: data.message,
        relatedId: data.related_id,
        isRead: data.is_read,
        createdAt: data.created_at,
        createdBy: data.created_by
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  markAllAsRead: async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
  
  deleteAll: async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
};
