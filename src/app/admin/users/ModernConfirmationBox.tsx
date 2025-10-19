'use client';

import React from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ModernConfirmationBoxProps {
  isOpen: boolean;
  title: string;
  confirmationMessage: string;
  objectName: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
}

const ModernConfirmationBox: React.FC<ModernConfirmationBoxProps> = ({
  isOpen,
  title,
  confirmationMessage,
  objectName,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  if (!isOpen) return null;

  const isActivate = confirmText.toLowerCase().includes('activate');
  const isDelete = confirmText.toLowerCase().includes('delete');

  const getIcon = () => {
    if (isActivate) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (isDelete) return <XCircle className="w-6 h-6 text-red-500" />;
    return <AlertTriangle className="w-6 h-6 text-orange-500" />;
  };

  const getBgColor = () => {
    if (isActivate) return 'bg-green-50 border-green-200';
    if (isDelete) return 'bg-red-50 border-red-200';
    return 'bg-orange-50 border-orange-200';
  };

  const getTextColor = () => {
    if (isActivate) return 'text-green-800';
    if (isDelete) return 'text-red-800';
    return 'text-orange-800';
  };

  const getButtonStyle = () => {
    if (isActivate) return 'bg-green-600 hover:bg-green-700 text-white';
    if (isDelete) return 'bg-red-600 hover:bg-red-700 text-white';
    return 'bg-orange-600 hover:bg-orange-700 text-white';
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full ${getBgColor()} border rounded-xl shadow-2xl overflow-hidden`}>
        {/* Modern Header */}
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                {getIcon()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-white/80 text-sm">Confirm your action</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            {getIcon()}
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${getTextColor()} mb-2`}>
                {confirmationMessage}
              </h4>
              <p className={`text-sm ${getTextColor()} mb-2`}>
                <strong>{objectName}</strong>
              </p>
              <p className={`text-sm ${getTextColor()}`}>
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${getButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernConfirmationBox;
