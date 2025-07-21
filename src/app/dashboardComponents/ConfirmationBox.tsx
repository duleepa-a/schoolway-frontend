'use client';
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, X, Info } from 'lucide-react';

type Variant = 'warning' | 'success' | 'error';

interface ConfirmationBoxProps {
  isOpen: boolean;
  variant?: Variant;
  title?: string;
  message?: string;
  confirmationMessage: string;
  objectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const variantConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-600',
    buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
};

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  isOpen,
  variant = 'warning',
  title = 'Are you sure?',
  message,
  confirmationMessage,
  objectName,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const { icon: Icon, iconColor, buttonColor } = variantConfig[variant];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-sm text-gray-600 mb-4">{confirmationMessage}</div>
          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <div className="text-sm font-medium text-gray-900">{objectName}</div>
          </div>
          {message && (
            <div className={`text-sm mb-4 ${
              variant === 'error'
                ? 'text-red-600'
                : variant === 'success'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}>
              {message}
            </div>
          )}
          <div className="text-sm text-gray-500">
            {variant === 'warning'
              ? 'This action cannot be undone.'
              : variant === 'error'
              ? 'An error may occur. Please proceed carefully.'
              : 'This was completed successfully.'}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 w-full sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 w-full sm:w-auto ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
