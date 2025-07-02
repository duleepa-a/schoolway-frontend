'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FormInput from '@/app/components/FormInput';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  retypePassword: string;
}

const SignUpForm = () => {
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    retypePassword: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.retypePassword) {
      newErrors.retypePassword = 'Please retype your password';
    } else if (formData.password !== formData.retypePassword) {
      newErrors.retypePassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log('Google sign up clicked');
  };

  const handleFacebookSignUp = () => {
    // Handle Facebook sign up
    console.log('Facebook sign up clicked');
  };

  return (
    
    <div className="flex w-3/4  bg-primary h-4/5 justify-between rounded-br-2xl rounded-tr-2xl">
      {/* Left side - Yellow background with logo */}
      <div className="hidden lg:block overflow-hidden justify-items-center pl-20 pt-4">
        <Image
        src={'/logo/Logo_light.svg'}
        alt='schoolway logo'
        width={200}
        height={200}
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center h-min">
        <div className="w-full ">
          <div className="bg-white rounded-2xl shadow-xl pt-14 pl-14 pr-7 pb-7 ">
            <div className='flex justify-start'>
                <h2 className="text-lg font-semibold text-active-text text-center mb-2.5">
                    Create Account
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="ml-1">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                    <FormInput
                        label="First Name"
                        name="firstName"
                        placeholder="Type your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        error={errors.firstName}
                    />
                </div>
                <div>
                    <FormInput
                        label="Last Name"
                        name="lastName"
                        placeholder='Type your last name'
                        value={formData.lastName}
                        onChange={handleInputChange}
                        error={errors.lastName}
                    />
                </div>
              </div>

              {/* Email field */}
              <div>
                <FormInput
                        label="Email"
                        name="email"
                        value={formData.email}
                        type="email"
                        placeholder='Type your email address'
                        onChange={handleInputChange}
                        error={errors.email}
                />
              </div>

              {/* Password field */}
              <div>
                <FormInput
                        label="password"
                        name="password"
                        value={formData.password}
                        type="password"
                        placeholder='Type your password'
                        onChange={handleInputChange}
                        error={errors.password}
                />
              </div>

              {/* Retype Password field */}
              <div>
                <FormInput
                        label="Confirm password"
                        name="retypepassword"
                        value={formData.retypePassword}
                        type="password"
                        placeholder='Retype your password'
                        onChange={handleInputChange}
                        error={errors.retypePassword}
                />
              </div>

              {/* Sign Up button */}
              <div className='w-full flex justify-center'>
                <button
                  type="submit"
                  className="
                  w-max bg-black hover:bg-active-text 
                  text-white font-semibold px-18 py-2.5
                  rounded-xs transition-colors duration-200  cursor-pointer text-sm"
                >
                  sign up
                </button>
              </div>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
                Login
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social login buttons */}
            <div className="flex space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="submit-bttn"
              >
                
                <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default SignUpForm