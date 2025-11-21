import { useEffect } from 'react';
import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Custom hook for Supabase real-time subscriptions
 * Automatically reloads data when changes occur in the database
 */
export function useRealtimeSubscription(
  table: string,
  onUpdate: () => void | Promise<void>
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Create a channel for the table
      channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events: INSERT, UPDATE, DELETE
            schema: 'public',
            table: table
          },
          async (payload) => {
            console.log(`[Real-time] ${table} changed:`, payload);
            // Call the update function
            await onUpdate();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Real-time] Subscribed to ${table} changes`);
          }
        });
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`[Real-time] Unsubscribed from ${table} changes`);
      }
    };
  }, [table, onUpdate]);
}

/**
 * Hook for subscribing to multiple tables
 */
export function useRealtimeSubscriptions(
  subscriptions: Array<{ table: string; onUpdate: () => void | Promise<void> }>
) {
  useEffect(() => {
    const channels: RealtimeChannel[] = [];

    subscriptions.forEach(({ table, onUpdate }) => {
      const channel = supabase
        .channel(`${table}_changes_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          async (payload) => {
            console.log(`[Real-time] ${table} changed:`, payload);
            await onUpdate();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Real-time] Subscribed to ${table} changes`);
          }
        });

      channels.push(channel);
    });

    // Cleanup all subscriptions on unmount
    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      console.log('[Real-time] Unsubscribed from all channels');
    };
  }, [subscriptions]);
}
