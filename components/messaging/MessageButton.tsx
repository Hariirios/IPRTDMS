import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Mail, MailOpen, Trash2, Plus, Reply } from 'lucide-react';
import { messageStore, Message, NewMessage } from '../../lib/messageStore';
import { supabase } from '../../lib/supabase';

interface MessageButtonProps {
  userId: string;
  userType: 'admin' | 'member';
  userName: string;
}

export function MessageButton({ userId, userType, userName }: MessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [availableRecipients, setAvailableRecipients] = useState<Array<{
    id: string;
    name: string;
    type: 'admin' | 'member';
    email: string;
  }>>([]);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipient_id: '',
    recipient_type: 'admin' as 'admin' | 'member',
    recipient_name: '',
    subject: '',
    message: '',
    isReply: false,
    originalMessageId: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      loadRecipients();
    } else {
      loadUnreadCount();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    // Load unread count on mount
    loadUnreadCount();
    
    // Set up interval to check for new messages
    const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [userId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageStore.getMessages(userId, userType);
      setMessages(data);
      await loadUnreadCount();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await messageStore.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadRecipients = async () => {
    try {
      const recipients = await messageStore.getAvailableRecipients(userType);
      console.log('Available recipients:', recipients);
      setAvailableRecipients(recipients);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  // Simple test function to check database connection
  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      const { data, error } = await supabase.from('messages').select('count').limit(1);
      if (error) {
        console.error('Database connection test failed:', error);
        // If messages table doesn't exist, that's likely the issue
        if (error.message?.includes('relation "messages" does not exist')) {
          setError('Messages table does not exist. Please run the setup SQL script first.');
        }
        return false;
      }
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!composeForm.recipient_id || !composeForm.subject || !composeForm.message) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending message:', {
        userId,
        userType,
        userName,
        composeForm
      });

      // Try to send message directly without testing connection first
      const messageData = {
        sender_id: userId,
        sender_type: userType,
        sender_name: userName,
        recipient_id: composeForm.recipient_id,
        recipient_type: composeForm.recipient_type,
        recipient_name: composeForm.recipient_name,
        subject: composeForm.subject,
        message: composeForm.message,
        is_read: false
      };

      console.log('Inserting message data:', messageData);

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('relation "messages" does not exist')) {
          setError('Messages table does not exist. Please run the setup SQL script first.');
        } else if (error.message?.includes('permission denied')) {
          setError('Permission denied. Please check your database policies.');
        } else if (error.message?.includes('violates check constraint')) {
          setError('Invalid data format. Please check your input.');
        } else {
          setError(`Database error: ${error.message}`);
        }
        return;
      }

      console.log('Message sent successfully:', data);

      // Reset form
      resetComposeForm();

      setSuccess('Message sent successfully!');
      
      // Switch back to inbox and reload messages after a short delay
      setTimeout(() => {
        setActiveTab('inbox');
        setSuccess(null);
      }, 1500);
      
      await loadMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message: Message) => {
    if (!message.is_read && message.recipient_id === userId) {
      try {
        await messageStore.markAsRead(message.id);
        await loadMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await messageStore.deleteMessage(messageId);
      await loadMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleRecipientChange = (recipientId: string) => {
    const recipient = availableRecipients.find(r => r.id === recipientId);
    if (recipient) {
      setComposeForm(prev => ({
        ...prev,
        recipient_id: recipientId,
        recipient_type: recipient.type,
        recipient_name: recipient.name
      }));
    }
  };

  // Handle reply to a message
  const handleReply = (message: Message) => {
    setComposeForm({
      recipient_id: message.sender_id,
      recipient_type: message.sender_type,
      recipient_name: message.sender_name,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
      message: `\n\n--- Original Message ---\nFrom: ${message.sender_name}\nDate: ${new Date(message.created_at).toLocaleString()}\nSubject: ${message.subject}\n\n${message.message}`,
      isReply: true,
      originalMessageId: message.id
    });
    setActiveTab('compose');
  };

  // Reset compose form
  const resetComposeForm = () => {
    setComposeForm({
      recipient_id: '',
      recipient_type: 'admin',
      recipient_name: '',
      subject: '',
      message: '',
      isReply: false,
      originalMessageId: ''
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Message Button - Fixed position bottom right */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Message Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col mt-2 mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'inbox'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="h-4 w-4 inline mr-2" />
                  Inbox
                </button>
                <button
                  onClick={() => setActiveTab('compose')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'compose'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Compose
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'inbox' ? (
                  <div className="flex h-full">
                    {/* Message List */}
                    <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                      {loading ? (
                        <div className="p-6 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading messages...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="p-6 text-center">
                          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              onClick={() => {
                                setSelectedMessage(message);
                                handleMarkAsRead(message);
                              }}
                              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedMessage?.id === message.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {message.recipient_id === userId && !message.is_read ? (
                                    <Mail className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <MailOpen className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className={`font-medium ${
                                    message.recipient_id === userId && !message.is_read
                                      ? 'text-gray-900 dark:text-white'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {message.sender_id === userId ? `To: ${message.recipient_name}` : message.sender_name}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.created_at)}
                                </span>
                              </div>
                              <h4 className={`font-medium mb-1 ${
                                message.recipient_id === userId && !message.is_read
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {message.subject}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Detail */}
                    <div className="w-1/2 flex flex-col">
                      {selectedMessage ? (
                        <>
                          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                  {selectedMessage.subject}
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <p>From: {selectedMessage.sender_name}</p>
                                  <p>To: {selectedMessage.recipient_name}</p>
                                  <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {selectedMessage.sender_id !== userId && (
                                  <button
                                    onClick={() => handleReply(selectedMessage)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Reply to this message"
                                  >
                                    <Reply className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete this message"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-6 overflow-y-auto">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Select a message to read</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Compose Form */
                  <div className="h-full flex flex-col">
                    <form onSubmit={handleSendMessage} className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="p-6 space-y-4">
                          {/* Error/Success Messages */}
                          {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                          )}
                          
                          {success && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                            </div>
                          )}

                          {composeForm.isReply && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                📧 Replying to message from {composeForm.recipient_name}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              To
                            </label>
                            {composeForm.isReply ? (
                              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {composeForm.recipient_name} ({composeForm.recipient_type})
                              </div>
                            ) : (
                              <select
                                value={composeForm.recipient_id}
                                onChange={(e) => handleRecipientChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                              >
                                <option value="">Select recipient...</option>
                                {availableRecipients.map((recipient) => (
                                  <option key={recipient.id} value={recipient.id}>
                                    {recipient.name} ({recipient.type})
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Subject
                            </label>
                            <input
                              type="text"
                              value={composeForm.subject}
                              onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter subject..."
                              required
                            />
                          </div>

                          <div className="flex-1 min-h-0">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Message
                            </label>
                            <textarea
                              value={composeForm.message}
                              onChange={(e) => setComposeForm(prev => ({ ...prev, message: e.target.value }))}
                              className="w-full h-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                              placeholder="Type your message..."
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fixed Button Area - Always Visible */}
                      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              resetComposeForm();
                              setActiveTab('inbox');
                            }}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading || !composeForm.recipient_id || !composeForm.subject || !composeForm.message}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                          >
                            <Send className="h-4 w-4" />
                            {loading ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}