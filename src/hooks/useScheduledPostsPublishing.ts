'use client';

import { useEffect, useRef } from 'react';

interface UseScheduledPostsPublishingOptions {
  intervalMs?: number; // Default 5 minutes
  enabled?: boolean; // Default true
}

export const useScheduledPostsPublishing = (options: UseScheduledPostsPublishingOptions = {}) => {
  const { intervalMs = 5 * 60 * 1000, enabled = true } = options; // Default 5 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const checkAndPublishScheduledPosts = async () => {
    try {
      console.log('🔄 Checking for scheduled posts...');
      
      const response = await fetch('/api/admin/awareness/publish-scheduled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout and better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.publishedCount > 0) {
        console.log(`🎉 Published ${result.publishedCount} scheduled posts:`, result.publishedPosts);
        retryCountRef.current = 0; // Reset retry count on success
        
        // You could dispatch a custom event here to notify other components
        window.dispatchEvent(new CustomEvent('scheduledPostsPublished', {
          detail: {
            count: result.publishedCount,
            posts: result.publishedPosts,
          }
        }));
      } else if (result.success) {
        console.log('No scheduled posts ready to publish');
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        console.error('Failed to check scheduled posts:', result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('⏰ Scheduled posts check timed out');
        } else if (error.message.includes('Failed to fetch')) {
          console.warn('🌐 Network error checking scheduled posts - server may be unavailable');
          retryCountRef.current++;
          if (retryCountRef.current < maxRetries) {
            console.log(`🔄 Retrying scheduled posts check (${retryCountRef.current}/${maxRetries})...`);
            setTimeout(checkAndPublishScheduledPosts, 5000); // Retry after 5 seconds
          } else {
            console.error('Max retries reached for scheduled posts check');
            retryCountRef.current = 0; // Reset retry count
          }
        } else {
          console.error('Error checking scheduled posts:', error.message);
        }
      } else {
        console.error('Unknown error checking scheduled posts:', error);
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Run immediately on mount
    checkAndPublishScheduledPosts();

    // Set up interval
    intervalRef.current = setInterval(checkAndPublishScheduledPosts, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, enabled]);

  return {
    checkAndPublishScheduledPosts,
  };
};
