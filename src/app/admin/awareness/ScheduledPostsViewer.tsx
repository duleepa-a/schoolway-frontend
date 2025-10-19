'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Edit, Trash2, Play, Image } from 'lucide-react';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';
import EnhancedEditModal from './EnhancedEditModal';
import ModernAlert from './ModernAlert';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  targetAudience: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  scheduledDate: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  views: number;
  UserProfile?: {
    firstname?: string;
    lastname?: string;
  };
}

const ScheduledPostsViewer = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState<ScheduledPost | null>(null);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [postToPublish, setPostToPublish] = useState<ScheduledPost | null>(null);

  // Modern alert state
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'info',
    title: '',
    message: ''
  });

  const showAlert = (variant: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setAlert({
      isOpen: true,
      variant,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const categories = [
    'Safety Awareness',
    'Health & Wellness',
    'School Events',
    'Policy Updates',
    'Emergency Procedures',
    'Community News',
    'Educational Resources',
    'Other'
  ];

  const targetAudiences = [
    'All Users',
    'Parents Only',
    'Staff Only',
    'Drivers Only',
    'Van Service Owners Only'
  ];

  const fetchScheduledPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/awareness?scheduled=true');
      if (response.ok) {
        const data = await response.json();
        console.log('Scheduled posts data:', data);
        console.log('Posts with images:', data.posts?.filter((post: ScheduledPost) => post.imageUrl));
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch scheduled posts');
        showAlert('error', 'Error', 'Failed to fetch scheduled posts');
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      showAlert('error', 'Error', 'Failed to fetch scheduled posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScheduledPosts();
  }, [fetchScheduledPosts]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/admin/awareness/${postToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteConfirmation(false);
        setPostToDelete(null);
        setConfirmationMessage('Scheduled post deleted successfully!');
        setShowSuccessConfirmation(true);
        fetchScheduledPosts(); // Refresh the list
      } else {
        throw new Error('Failed to delete scheduled post');
      }
    } catch (error) {
      console.error('Error deleting scheduled post:', error);
      setShowDeleteConfirmation(false);
      setPostToDelete(null);
      setConfirmationMessage('Failed to delete scheduled post. Please try again.');
      setShowErrorConfirmation(true);
    }
  };

  const handlePublishNow = async (post: ScheduledPost) => {
    setPostToPublish(post);
    setShowPublishConfirmation(true);
  };

  const confirmPublishNow = async () => {
    if (!postToPublish) return;
    
    try {
      const response = await fetch(`/api/admin/awareness/${postToPublish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postToPublish,
          isPublished: true,
          publishedAt: new Date().toISOString(),
          scheduledDate: null, // Clear scheduled date since it's now published
        }),
      });

      if (response.ok) {
        setConfirmationMessage('Post published successfully!');
        setShowSuccessConfirmation(true);
        fetchScheduledPosts(); // Refresh the list
      } else {
        setConfirmationMessage('Failed to publish post. Please try again.');
        setShowErrorConfirmation(true);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      setConfirmationMessage('Failed to publish post. Please try again.');
      setShowErrorConfirmation(true);
    } finally {
      setShowPublishConfirmation(false);
      setPostToPublish(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesAudience = !filterAudience || post.targetAudience === filterAudience;
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-gray-100 text-gray-800',
    ];
    const index = categories.indexOf(category);
    return colors[index] || colors[6];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Scheduled Posts</h2>
            <p className="text-gray-600">Posts scheduled for future publication</p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Posts
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Audiences</option>
              {targetAudiences.map(audience => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Scheduled Posts</h3>
          <p className="text-gray-500">No posts match your current filters or no posts have been scheduled yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              {post.imageUrl ? (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', post.imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', post.title);
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Image className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                {/* Content Preview */}
                <div 
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Category and Priority */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(post.priority)}`}>
                    {post.priority} Priority
                  </span>
                </div>

                {/* Target Audience */}
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Target:</span> {post.targetAudience}
                </div>

                {/* Scheduled Date */}
                <div className="flex items-center text-sm text-blue-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Scheduled for:</span>
                  <span className="ml-1">{formatDate(post.scheduledDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setShowEditModal(true);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handlePublishNow(post)}
                    className="flex-1 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Publish Now
                  </button>
                  <button
                    onClick={() => {
                      setPostToDelete(post);
                      setShowDeleteConfirmation(true);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationBox
        isOpen={showDeleteConfirmation}
        title="Confirm Deletion"
        variant='warning'
        confirmationMessage="Are you sure you want to delete this scheduled post? This action cannot be undone."
        objectName={postToDelete ? postToDelete.title : ''}
        onConfirm={handleDeletePost}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setPostToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Publish Confirmation */}
      <ConfirmationBox
        isOpen={showPublishConfirmation}
        title="Confirm Publishing"
        variant='success'
        confirmationMessage="Are you sure you want to publish this scheduled post now? It will be visible to all users immediately."
        objectName={postToPublish ? postToPublish.title : ''}
        onConfirm={confirmPublishNow}
        onCancel={() => {
          setShowPublishConfirmation(false);
          setPostToPublish(null);
        }}
        confirmText="Publish Now"
        cancelText="Cancel"
      />

      {/* Success Confirmation */}
      <ConfirmationBox
        isOpen={showSuccessConfirmation}
        variant='success'
        title="Success"
        confirmationMessage={confirmationMessage}
        objectName=""
        onConfirm={() => setShowSuccessConfirmation(false)}
        onCancel={() => setShowSuccessConfirmation(false)}
        confirmText="OK"
        cancelText="Close"
      />

      {/* Error Confirmation */}
      <ConfirmationBox
        isOpen={showErrorConfirmation}
        title="Error"
        variant='error'
        confirmationMessage={confirmationMessage}
        objectName=""
        onConfirm={() => setShowErrorConfirmation(false)}
        onCancel={() => setShowErrorConfirmation(false)}
        confirmText="OK"
        cancelText="Close"
      />

      {/* Enhanced Edit Modal */}
      {editingPost && (
        <EnhancedEditModal
          isOpen={showEditModal}
          post={editingPost}
          onClose={() => {
            setShowEditModal(false);
            setEditingPost(null);
          }}
          onSuccess={() => {
            fetchScheduledPosts();
            setShowEditModal(false);
            setEditingPost(null);
          }}
          showScheduledDate={true}
        />
      )}

      {/* Modern Alert */}
      {alert.isOpen && (
        <ModernAlert
          isOpen={alert.isOpen}
          onClose={closeAlert}
          type={alert.variant}
          title={alert.title}
          message={alert.message}
        />
      )}
    </div>
  );
};

export default ScheduledPostsViewer;