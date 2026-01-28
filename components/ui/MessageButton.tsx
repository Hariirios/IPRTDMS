import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Users, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { messageStore, Message } from '../../lib/messageStore';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Avatar, AvatarFallback } from './avatar';

interface MessageButtonProps {
  userType: 'admin' | 'member';
  userId: string;
  userName: string;
}

export function MessageButton({ userType, userId, userName }: MessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Compose form state
  const [recipients, setRecipients] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      loadRecipients();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    // Load unread count periodically
    const interval = setInterval(loadUnreadCount, 30000); // Every 30 seconds
    loadU