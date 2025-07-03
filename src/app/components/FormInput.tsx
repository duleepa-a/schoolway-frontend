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
              <label htmlFor={name} className="form-label">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-input-field 
                  ${
                    error
                      ? 'form-input-field-error'
                      : 'form-input-field-valid  '
                  }`}
              />
              {error && <p className="error-msg">{error}</p>}
          </div>

  );
};

export default FormInput;
