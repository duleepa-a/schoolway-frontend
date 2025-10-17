
'use client';

import React, { useState } from "react";
import Image from "next/image";
import { 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  Tag, 
  Users, 
  Globe, 
  Save, 
  Send, 
  X,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import TextEditor from '@/app/components/TextEditor';

interface AwarenessPostFormData {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  targetAudience: string;
  priority: 'low' | 'medium' | 'high';
  scheduledDate?: string;
  isPublished: boolean;
}

const AwarenessPostCreator: React.FC = () => {
  const [formData, setFormData] = useState<AwarenessPostFormData>({
    title: '',
    content: '',
    imageUrl: '',
    category: '',
    targetAudience: '',
    priority: 'medium',
    scheduledDate: '',
    isPublished: false
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Safety Awareness',
    'Health & Wellness',
    'School Events',
    'Policy Updates',
    'Emergency Procedures',
    'Community News',
    'Educational Resources'
  ];

  const targetAudiences = [
    'All Users',
    'Parents Only',
    'Students Only',
    'Staff Only',
    'Drivers Only',
    'Van Owners Only'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImages([file]);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  const removeImage = () => {
    setUploadedImages([]);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
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

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Please upload an image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'publish') => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically upload the image to a cloud service
      // and then save the post data to your database
      console.log('Submitting awareness post:', {
        ...formData,
        isPublished: action === 'publish',
        action
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form after successful submission
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        category: '',
        targetAudience: '',
        priority: 'medium',
        scheduledDate: '',
        isPublished: false
      });
      setUploadedImages([]);
      setImagePreview('');
      setErrors({});

      alert(`Awareness post ${action === 'save' ? 'saved as draft' : 'published'} successfully!`);
    } catch (error) {
      console.error('Error submitting awareness post:', error);
      alert('Failed to submit awareness post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Awareness Post</h1>
                <p className="text-white/80 text-sm">Share important information with the community</p>
              </div>
            </div>
            <button
              onClick={togglePreview}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={(e) => handleSubmit(e, 'save')} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                    }`}
                    style={{ '--tw-ring-color': errors.title ? '#fecaca' : '#00d4aa' } as React.CSSProperties}
                    placeholder="Enter a compelling title for your awareness post"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Category and Target Audience Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.category ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="targetAudience" className="block text-sm font-semibold text-gray-700">
                      Target Audience *
                    </label>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.targetAudience ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                      }`}
                    >
                      <option value="">Select target audience</option>
                      {targetAudiences.map(audience => (
                        <option key={audience} value={audience}>{audience}</option>
                      ))}
                    </select>
                    {errors.targetAudience && <p className="text-red-500 text-sm">{errors.targetAudience}</p>}
                  </div>
                </div>

                {/* Priority and Scheduled Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="scheduledDate" className="block text-sm font-semibold text-gray-700">
                      Schedule Post (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledDate"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                    Post Content *
                  </label>
                  <div className="min-h-[300px]">
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
                  {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'publish')}
                    disabled={isLoading}
                    className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                    style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
                  >
                    <Send className="mr-2" size={18} />
                    {isLoading ? 'Publishing...' : 'Publish Post'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200 disabled:opacity-50"
                  >
                    <Save className="mr-2" size={18} />
                    {isLoading ? 'Saving...' : 'Save Draft'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Image Upload and Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-fit">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <ImageIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Featured Image</h3>
                  <p className="text-sm text-gray-600">Upload a cover image</p>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="p-6">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Upload an image</p>
                      <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                    </div>
                    <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-48 relative rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Click the X to remove image</p>
                </div>
              )}
              {errors.imageUrl && <p className="text-red-500 text-sm mt-2">{errors.imageUrl}</p>}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-6">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
              </div>
              <div className="p-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  {imagePreview && (
                    <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={imagePreview}
                        alt={formData.title || 'Preview'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {formData.title || 'Your post title will appear here'}
                  </h3>
                  <div 
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content || 'Your post content will appear here...' 
                    }}
                  />
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <Tag size={12} />
                    <span>{formData.category || 'Category'}</span>
                    <span>•</span>
                    <Users size={12} />
                    <span>{formData.targetAudience || 'Target Audience'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwarenessPostCreator;
