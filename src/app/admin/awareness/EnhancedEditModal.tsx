'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Upload, Image as ImageIcon, FileText, Tag, Users, Trash2 } from 'lucide-react';
import TextEditor from '@/app/components/TextEditor';
import ModernAlert from './ModernAlert';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  scheduledDate?: string;
  imageUrl?: string;
}

interface EnhancedEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  showScheduledDate?: boolean;
  onSuccess?: () => void;
}

const EnhancedEditModal = ({ 
  isOpen, 
  onClose, 
  post, 
  showScheduledDate = false,
  onSuccess 
}: EnhancedEditModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    targetAudience: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    scheduledDate: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update form data when post changes
  useEffect(() => {
    if (post) {
      // Handle scheduled date conversion properly
      let formattedScheduledDate = '';
      if (post.scheduledDate) {
        const date = new Date(post.scheduledDate);
        // Convert to local timezone and format for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedScheduledDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category || '',
        targetAudience: post.targetAudience || '',
        priority: post.priority || 'MEDIUM',
        scheduledDate: formattedScheduledDate,
      });
      setImagePreview(post.imageUrl || null);
      setNewImageFile(null);
    }
  }, [post]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setNewImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const removeImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.targetAudience) {
      newErrors.targetAudience = 'Target audience is required';
    }

    // Only validate scheduled date if it's provided
    if (showScheduledDate && formData.scheduledDate) {
      const scheduledDate = new Date(formData.scheduledDate);
      const now = new Date();
      const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);

      if (scheduledDate <= twentyMinutesFromNow) {
        newErrors.scheduledDate = 'Scheduled date must be at least 20 minutes from now';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !post) return;

    setIsLoading(true);

    try {
      const updateData: any = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        targetAudience: formData.targetAudience,
        priority: formData.priority,
      };

      if (showScheduledDate && formData.scheduledDate) {
        updateData.scheduledDate = new Date(formData.scheduledDate).toISOString();
      }

      // Handle image upload
      if (newImageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          updateData.imageUrl = base64Image;
          
          const response = await fetch(`/api/admin/awareness/${post.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              onSuccess?.();
              onClose();
            }, 1500);
          } else {
            const errorData = await response.json();
            console.error('Update failed:', errorData);
          }
        };
        reader.readAsDataURL(newImageFile);
      } else {
        const response = await fetch(`/api/admin/awareness/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            onSuccess?.();
            onClose();
          }, 1500);
        } else {
          const errorData = await response.json();
          console.error('Update failed:', errorData);
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
        <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Beautiful Gradient Header */}
          <div className="px-6 py-4 rounded-t-xl" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Edit Awareness Post</h2>
                  <p className="text-white/80 text-sm">Update your post content and settings</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Updating post...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="Enter post title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Content *
                  </label>
                  <div className={`border rounded-lg transition-all duration-200 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <TextEditor
                      value={formData.content}
                      onChange={(content) => {
                        setFormData(prev => ({ ...prev, content }));
                        if (errors.content) {
                          setErrors(prev => ({ ...prev, content: '' }));
                        }
                      }}
                    />
                  </div>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                {/* Category and Target Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                      }`}
                    >
                      <option value="">Select category</option>
                      <option value="Safety Awareness">Safety Awareness</option>
                      <option value="Health & Wellness">Health & Wellness</option>
                      <option value="School Events">School Events</option>
                      <option value="Transportation Updates">Transportation Updates</option>
                      <option value="Emergency Alerts">Emergency Alerts</option>
                      <option value="General Announcements">General Announcements</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Target Audience *
                    </label>
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.targetAudience ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                      }`}
                    >
                      <option value="">Select audience</option>
                      <option value="All Users">All Users</option>
                      <option value="Parents Only">Parents Only</option>
                      <option value="Students Only">Students Only</option>
                      <option value="Staff Only">Staff Only</option>
                      <option value="Drivers Only">Drivers Only</option>
                      <option value="Van Service Owners Only">Van Service Owners Only</option>
                    </select>
                    {errors.targetAudience && (
                      <p className="mt-1 text-sm text-red-600">{errors.targetAudience}</p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                </div>

                {/* Scheduled Date (if applicable) */}
                {showScheduledDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Scheduled Date & Time (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        min={new Date(Date.now() + 20 * 60 * 1000).toISOString().slice(0, 16)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10 ${
                          errors.scheduledDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.scheduledDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Post Image
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
                      <img
                        src={imagePreview}
                        alt="Post preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          <ImageIcon className="w-4 h-4 inline mr-1" />
                          {newImageFile ? 'New Image' : 'Current Image'}
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Post'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Success Alert */}
      <ModernAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type="success"
        title="Post Updated!"
        message="Your post has been updated successfully."
      />
    </>
  );
};

export default EnhancedEditModal;