'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface PopupFormProps {
  isOpen: boolean;
  heading: string;
  fields: InputField[];
  actionButtons: ActionButton[];
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
  size?: 'small' | 'medium' | 'large';
}

const PopupForm: React.FC<PopupFormProps> = ({
  isOpen,
  heading,
  fields,
  actionButtons,
  onClose,
  onSubmit,
  initialData = {},
  size = 'medium'
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
      const value = formData[field.name] || '';
      
      // Required field validation
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const validationError = field.validation(value);
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

    const inputBaseClasses = `w-full px-3 py-2 border rounded-md shadow-sm outline-none transition-all duration-200 text-sm ${
      hasError 
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
        : 'border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100'
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
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-2"
      onClick={handleOverlayClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden flex flex-col w-full ${
          size === 'small' ? 'max-w-md' : 
          size === 'large' ? 'max-w-2xl sm:max-w-full' : 
          'max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between p-6 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {heading}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col flex-1"
        >
          <div className="flex-1 p-6 sm:p-4 overflow-y-auto space-y-4">
            {fields.map((field) => (
              <div 
                key={field.name} 
                className="flex flex-col space-y-2"
              >
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-700"
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

          <div className="p-6 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                type={button.type}
                onClick={button.onClick}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto ${
                  button.variant === 'primary' 
                    ? 'bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-400' :
                  button.variant === 'danger' 
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' : 
                    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
