'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Image } from 'lucide-react';

interface AwarenessPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  targetAudience: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  publishedAt: string;
}

interface AwarenessPostsResponse {
  posts: AwarenessPost[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AwarenessPostsSection() {
  const [posts, setPosts] = useState<AwarenessPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (posts.length <= 1) return; // Don't auto-scroll if there's only one or no posts

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % posts.length);
    }, 8000); // Change slide every 8 seconds (increased from 6 seconds)

    return () => clearInterval(interval);
  }, [posts.length]);

  const fetchPublishedPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/awareness?isPublished=true&limit=10');
      
      if (!response.ok) {
        throw new Error('Failed to fetch awareness posts');
      }
      
      const data: AwarenessPostsResponse = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching awareness posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex(prev => Math.min(posts.length - 1, prev + 1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    const cleanContent = stripHtmlTags(content);
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
            <p className="text-gray-600 text-xs">Stay informed with our latest awareness posts</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-40 w-full max-w-xs rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
            <p className="text-red-600 text-xs">Unable to load awareness posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
            <p className="text-gray-600 text-xs">No awareness posts available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
          <p className="text-gray-600 text-xs">Stay informed with our latest awareness posts</p>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous post"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>

          <button
            onClick={scrollRight}
            disabled={currentIndex >= posts.length - 1}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next post"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Posts container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {posts.map((post) => (
                <div key={post.id} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    {/* Image */}
                    {post.imageUrl ? (
                      <div className="aspect-[3/2] w-full overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <Image className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs">No image</p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-2">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(post.priority)}`}>
                          {post.priority}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>

                      {/* Category and Target Audience */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {post.category}
                        </span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          {post.targetAudience}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Content */}
                      <p className="text-gray-600 text-xs line-clamp-3">
                        {truncateContent(post.content, 100)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-3 space-x-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
