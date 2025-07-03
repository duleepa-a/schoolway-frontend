'use client';

import React from 'react';

interface FormDateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  name,
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
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-input-field ${
          error ? 'form-input-field-error' : 'form-input-field-valid'
        }`}
      />
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default FormDateInput;
