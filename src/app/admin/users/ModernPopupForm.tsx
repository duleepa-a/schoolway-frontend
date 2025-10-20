'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
}

interface ActionButton {
  label: string;
  type: 'submit' | 'button';
  variant: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

interface ModernPopupFormProps {
  isOpen: boolean;
  heading: string;
  fields: InputField[];
  actionButtons: ActionButton[];
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
}

const ModernPopupForm: React.FC<ModernPopupFormProps> = ({
  isOpen,
  heading,
  fields,
  actionButtons,
  onClose,
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when popup opens
  useEffect(() => {
    if (isOpen) {
      const defaultData: Record<string, string> = {};
      fields.forEach(field => {
        defaultData[field.name] = initialData[field.name] || '';
      });
      setFormData(defaultData);
      setErrors({});
      
      // Disable body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when popup is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fields, initialData]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.validation && formData[field.name]) {
        const validationError = field.validation(formData[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderField = (field: InputField) => {
    const value = formData[field.name] || '';
    const hasError = !!errors[field.name];

    const inputBaseClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
      hasError 
        ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-300'
    }`;

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className={inputBaseClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={`${inputBaseClasses} resize-y min-h-[100px]`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={inputBaseClasses}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{heading}</h2>
                <p className="text-white/80 text-sm">Update user information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col flex-1"
        >
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {fields.map((field) => (
              <div 
                key={field.name} 
                className="space-y-2"
              >
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-semibold text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <span className="text-sm text-red-600">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Modern Action Buttons */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex gap-3">
              {actionButtons.map((button, index) => (
                <button
                  key={index}
                  type={button.type}
                  onClick={button.onClick}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                    button.variant === 'primary' 
                      ? 'text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0' 
                      : button.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500'
                  }`}
                  style={button.variant === 'primary' ? { background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' } : {}}
                >
                  {button.variant === 'primary' && <Save size={16} />}
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernPopupForm;


