'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, User, Tag, Users, Image } from 'lucide-react';
import EnhancedEditModal from './EnhancedEditModal';
import ModernAlert from './ModernAlert';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  targetAudience: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  publishedAt: string;
  createdAt: string;
  views: number;
  UserProfile: {
    firstname: string;
    lastname: string;
  };
}

const PublishedPostsViewer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/awareness?isPublished=true');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setPostToDelete(post);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/admin/awareness/${postToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postToDelete.id));
        setShowDeleteConfirmation(false);
        setPostToDelete(null);
        setConfirmationMessage('Post deleted successfully!');
        setShowSuccessConfirmation(true);
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setShowDeleteConfirmation(false);
      setPostToDelete(null);
      setConfirmationMessage('Failed to delete post. Please try again.');
      setShowErrorConfirmation(true);
    }
  };

  const handleEditSuccess = () => {
    fetchPosts();
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesAudience = !filterAudience || post.targetAudience === filterAudience;
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filter Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Published Posts</h2>
              <p className="text-gray-600">Posts that are currently live and visible to users</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPosts.length} of {posts.length} posts
            </div>
          </div>

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
                <option value="Safety Awareness">Safety Awareness</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="School Events">School Events</option>
                <option value="Policy Updates">Policy Updates</option>
                <option value="Emergency Procedures">Emergency Procedures</option>
                <option value="Community News">Community News</option>
                <option value="Educational Resources">Educational Resources</option>
                <option value="Other">Other</option>
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
                <option value="All Users">All Users</option>
                <option value="Parents Only">Parents Only</option>
                <option value="Staff Only">Staff Only</option>
                <option value="Drivers Only">Drivers Only</option>
                <option value="Van Service Owners Only">Van Service Owners Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
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
                      e.currentTarget.style.display = 'none';
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

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(post.priority)}`}>
                    {post.priority}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    {post.category}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {post.targetAudience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-2" />
                    {post.views} views
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {post.UserProfile?.firstname || 'Unknown'} {post.UserProfile?.lastname || 'User'}
                  </div>
                </div>

                <div className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {post.content.replace(/<[^>]*>/g, '')}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No published posts found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EnhancedEditModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        showScheduledDate={false}
        onSuccess={handleEditSuccess}
      />

      {/* Alert */}
      <ModernAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type="success"
        title="Success!"
        message="Operation completed successfully!"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationBox
        isOpen={showDeleteConfirmation}
        title="Confirm Deletion"
        variant='warning'
        confirmationMessage="Are you sure you want to delete this post? This action cannot be undone."
        objectName={postToDelete ? postToDelete.title : ''}
        onConfirm={confirmDeletePost}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setPostToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Success Confirmation Dialog */}
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

      {/* Error Confirmation Dialog */}
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
    </>
  );
};

export default PublishedPostsViewer;