'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  error
}) => {
  return (
          <div className="mb-2">
              <label htmlFor={name} className="text-sm block font-semibold text-active-text mb-2">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2 text-sm rounded-xl border transition-all outline-none 
                  ${
                    error
                      ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-300 focus:border-yellow-400 '
                  }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

  );
};

export default FormInput;
