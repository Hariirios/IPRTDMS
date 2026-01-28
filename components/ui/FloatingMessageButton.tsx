import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Users, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { messageStore, Message } from '../../lib/messageStore';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Avatar, AvatarFallback } from './avatar';
import { toast } from 'sonner';

interface FloatingMessageButtonProps {
  userType: 'admin' | 'member';
  userId: string;
  userName: string;
}

export function FloatingMessageButton({ userType, userId, userName }: FloatingMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'conversation' | 'compose'>('list');

  // Load initial data
  useEffect(() => {
    loadUnreadCount();
    loadMessages();
    loadAvailableUsers();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadUnreadCount();
      loadMessages();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId, userType]);

  const loadUnreadCount = async () => {
    const count = await messageStore.getUnreadCount(userId, userType);
    setUnreadCount(count);
  };

  const loadMessages = async () => {
    const userMessages = await messageStore.getMessages(userId, userType);
    setMessages(userMessages);
  };

  const loadAvailableUsers = async () => {
    if (userType === 'admin') {
      const members = await messageStore.getAllMembers();
      setAvailableUsers(members);
    } else {
      // For members, they can only message admins
      // You might want to add a method to get admin users
      setAvailableUsers([]);
    }
  };

  const loadConversation = async (otherUserId: string) => {
    const conversation = await messageStore.getConversation(userId, otherUserId);
    setConversationMessages(conversation);
    
    // Mark messages as read
    const unreadMessages = conversation.filter(msg => 
      msg.recipient_id === userId && !msg.is_read
    );
    
    for (const msg of unreadMessages) {
      await messageStore.markAsRead(msg.id);
    }
    
    // Refresh unread count
    loadUnreadCount();
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    setLoading(true);
    try {
      const recipient = availableUsers.find(u => u.id === selectedConversation);
      if (!recipient) return;

      const result = await messageStore.sendMessage({
        sender_id: userId,
        sender_type: userType,
        sender_name: userName,
        recipient_id: selectedConversation,
        recipient_type: userType === 'admin' ? 'member' : 'admin',
        recipient_name: recipient.name,
        subject: subject || 'Message',
        content: newMessage
      });

      if (result.success) {
        setNewMessage('');
        setSubject('');
        loadConversation(selectedConversation);
        toast.success('Message sent successfully');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getConversationPartners = () => {
    const partners = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      const partnerName = msg.sender_id === userId ? msg.recipient_name : msg.sender_name;
      const partnerType = msg.sender_id === userId ? msg.recipient_type : msg.sender_type;
      
      if (!partners.has(partnerId)) {
        partners.set(partnerId, {
          id: partnerId,
          name: partnerName,
          type: partnerType,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      
      // Count unread messages from this partner
      if (msg.recipient_id === userId && !msg.is_read) {
        const partner = partners.get(partnerId);
        partner.unreadCount++;
      }
    });
    
    return Array.from(partners.values()).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );
  };

  const renderMessageList = () => {
    const partners = getConversationPartners();
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Messages</h3>
          <Button
            size="sm"
            onClick={() => setView('compose')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        
        <ScrollArea className="h-64">
          {partners.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : (
            partners.map(partner => (
              <div
                key={partner.id}
                onClick={() => {
                  setSelectedConversation(partner.id);
                  setView('conversation');
                  loadConversation(partner.id);
                }}
                className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {partner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {partner.name}
                      </p>
                      {partner.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {partner.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {partner.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(partner.lastMessage.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    );
  };

  const renderConversation = () => {
    const partner = availableUsers.find(u => u.id === selectedConversation) || 
                   getConversationPartners().find(p => p.id === selectedConversation);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('list')}
            >
              ←
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-600 text-white text-xs">
                {partner?.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {partner?.name || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {partner?.type === 'admin' ? 'Administrator' : 'Member'}
              </p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-48 border rounded-lg p-2">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No messages in this conversation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversationMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.sender_id === userId
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_id === userId ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="space-y-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[60px]"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    );
  };

  const renderCompose = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">New Message</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('list')}
          >
            ←
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
            <select
              value={selectedConversation || ''}
              onChange={(e) => setSelectedConversation(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select recipient...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject..."
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message:</label>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!selectedConversation || !newMessage.trim() || loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Message Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Messages</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              {view === 'list' && renderMessageList()}
              {view === 'conversation' && renderConversation()}
              {view === 'compose' && renderCompose()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}