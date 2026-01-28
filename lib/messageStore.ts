import { supabase } from './supabase';

export interface Message {
  id: string;
  sender_id: string;
  sender_type: 'admin' | 'member';
  sender_name: string;
  recipient_id: string;
  recipient_type: 'admin' | 'member';
  recipient_name: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewMessage {
  recipient_id: string;
  recipient_type: 'admin' | 'member';
  recipient_name: string;
  subject: string;
  message: string;
}

class MessageStore {
  async getMessages(userId: string, userType: 'admin' | 'member'): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  }

  async sendMessage(
    senderId: string,
    senderType: 'admin' | 'member',
    senderName: string,
    newMessage: NewMessage
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        sender_type: senderType,
        sender_name: senderName,
        ...newMessage
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  }

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get available recipients for messaging
  async getAvailableRecipients(currentUserType: 'admin' | 'member'): Promise<Array<{
    id: string;
    name: string;
    type: 'admin' | 'member';
    email: string;
  }>> {
    const recipients = [];

    if (currentUserType === 'admin') {
      // Admin can message members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, name, email')
        .eq('status', 'Active');

      if (!membersError && members) {
        recipients.push(...members.map(m => ({
          id: m.id,
          name: m.name,
          type: 'member' as const,
          email: m.email
        })));
      }
    } else {
      // Member can message admins
      const { data: admins, error: adminsError } = await supabase
        .from('admin_users')
        .select('id, username, email')
        .eq('is_active', true);

      if (!adminsError && admins) {
        recipients.push(...admins.map(a => ({
          id: a.id,
          name: a.username, // Use username as name for admins
          type: 'admin' as const,
          email: a.email
        })));
      }
    }

    return recipients;
  }
}

export const messageStore = new MessageStore();