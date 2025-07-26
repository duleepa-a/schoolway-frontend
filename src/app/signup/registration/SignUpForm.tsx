'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import FormInput from '@/app/components/FormInput';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   retypePassword: string;
// }

const SignUpForm = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [email, setEmail] = useState<string>('');
    const [userExists, setUserExists] = useState<boolean>(false);
    const [formData, setFormData] = useState({
      // Step 1 fields
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      // Step 2 fields
      serviceName: '',
      contactNumber: '',
      serviceRegistrationNumber: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

  
  // const [formData, setFormData] = useState<FormData>({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   password: '',
  //   retypePassword: ''
  // });

  // const [errors, setErrors] = useState<Partial<FormData>>({});

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
    
  //   // Clear error when user starts typing
  //   if (errors[name as keyof FormData]) {
  //     setErrors(prev => ({
  //       ...prev,
  //       [name]: ''
  //     }));
  //   }
  // };
 const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (name === "email" && value !== email ) {
    setEmail(value);
    const duplicate = await fetch('/api/signup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'email': value
      }
    });

    console.log("duplicate is ",duplicate);
    if(duplicate.status === 409) {
      setErrors(prev => ({
        ...prev,
        email: 'User with this email already exists'
      }));
      setUserExists(true);
    }else{
      setUserExists(false);
    }
  }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'first name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^0\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must start with 0 and be exactly 10 digits';
    }
    
    if (!formData.serviceRegistrationNumber.trim()) {
      newErrors.serviceRegistrationNumber = 'Service registration number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };
  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove confirmPassword from data sent to backend
      const { confirmPassword, ...dataToSubmit } = formData;
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          serviceName: '',
          contactNumber: '',
          serviceRegistrationNumber: ''
        });
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log("erro is ", error);
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     // Handle form submission
  //     console.log('Form submitted:', formData);
  //   }
  // };

  // const handleGoogleSignUp = () => {
  //   // Handle Google sign up
  //   console.log('Google sign up clicked');
  // };

  // const handleFacebookSignUp = () => {
  //   // Handle Facebook sign up
  //   console.log('Facebook sign up clicked');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-[var(--color-textwhite)] rounded-2xl shadow-2xl p-10">
        <AnimatePresence mode="wait">
    {currentStep === 1 && (
      <motion.div
        key="step1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >

        <div className='flex justify-start mb-6'>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--blue-shade-dark)' }}>
            Create Account
          </h2>
        </div>

            <form  className="ml-1"> {/* onSubmit={handleSubmit} */}
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
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        type="password"
                        placeholder='Retype your password'
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                />
              </div>

              {/* Sign Up button */}
              <div className='w-full flex justify-center mt-6'>
                <button
                  type="button"
                  onClick={handleNext} disabled={userExists}
                  className={!userExists
                    ? "w-max px-10 py-2.5 rounded-lg font-semibold text-white text-base transition-colors duration-200 cursor-pointer"
                    : "w-max px-10 py-2.5 rounded-lg font-semibold text-gray-400 bg-gray-300 text-base cursor-not-allowed"}
                  style={!userExists ? {
                    background: 'linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)',
                    boxShadow: '0 2px 8px 0 rgba(0,153,204,0.08)',
                    border: 'none'
                  } : {}}
                >
                  Proceed
                </button>
              </div>
            </form>

            {/* Login link */}
            <p className="text-center text-sm mt-5" style={{ color: 'var(--color-textgreydark)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium" style={{ color: 'var(--blue-shade-dark)' }}>
                Login
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t" style={{ borderColor: 'var(--color-textgreylight)' }}></div>
              <span className="px-4 text-sm" style={{ color: 'var(--color-textgreylight)' }}>or</span>
              <div className="flex-1 border-t" style={{ borderColor: 'var(--color-textgreylight)' }}></div>
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center">
              <button
                type="button"
                // onClick={handleGoogleSignUp}
                className="rounded-full border flex items-center gap-2 px-6 py-2 bg-[var(--color-textwhite)] hover:bg-[var(--color-background)] transition-colors"
                style={{ borderColor: 'var(--blue-shade-light)' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_993_156)">
                    <path d="M19.8052 10.2306C19.8052 9.55053 19.7491 8.86797 19.629 8.20093H10.2V12.0491H15.6261C15.3982 13.2941 14.6522 14.3827 13.6016 15.0768V17.3142H16.6812C18.4091 15.7327 19.8052 13.2727 19.8052 10.2306Z" fill="#4285F4"/>
                    <path d="M10.2 20C12.7009 20 14.7991 19.1827 16.6818 17.3142L13.6016 15.0768C12.5476 15.7827 11.2734 16.1868 10.2 16.1868C7.78363 16.1868 5.73636 14.5827 4.98363 12.3827H1.7854V14.6868C3.71454 17.9827 6.78363 20 10.2 20Z" fill="#34A853"/>
                    <path d="M4.98363 12.3827C4.78363 11.8768 4.67272 11.3327 4.67272 10.7727C4.67272 10.2127 4.78363 9.66862 4.98363 9.1627V6.85861H1.7854C1.14313 8.0827 0.8 9.3927 0.8 10.7727C0.8 12.1527 1.14313 13.4627 1.7854 14.6868L4.98363 12.3827Z" fill="#FBBC05"/>
                    <path d="M10.2 5.35861C11.3734 5.35861 12.4291 5.7627 13.2527 6.54907L16.7454 3.05861C14.7991 1.2768 12.7009 0.545441 10.2 0.545441C6.78363 0.545441 3.71454 2.5627 1.7854 5.85861L4.98363 8.1627C5.73636 5.9627 7.78363 5.35861 10.2 5.35861Z" fill="#EA4335"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_993_156">
                      <rect width="19" height="19.4545" fill="white" transform="translate(0.8 0.545441)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-medium text-base" style={{ color: 'var(--color-textblack)' }}>Sign up with Google</span>
              </button>
            </div>
      </motion.div>
    )}

    {currentStep === 2 && (
      <motion.div
        key="step2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >

        <div className='flex justify-start mb-6'>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--blue-shade-dark)' }}>
            Service Details
          </h2>
        </div>

              <form className="ml-1">
                {/* Service Name */}
                <div>
                <FormInput
                  label="Service Name"
                  name="serviceName"
                  placeholder="Type your service name"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  error={errors.serviceName}
                />
                </div>

                {/* Contact Number */}
                <div>
                <FormInput
                  label="Contact Number"
                  name="contactNumber"
                  placeholder="Type your contact number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  error={errors.contactNumber}
                />
                </div>

                {/* Service Registration Number */}
                <div>
                <FormInput
                  label="Service Registration Number"
                  name="serviceRegistrationNumber"
                  placeholder="Type your registration number"
                  value={formData.serviceRegistrationNumber}
                  onChange={handleInputChange}
                  error={errors.serviceRegistrationNumber}
                />
                </div>

                {/* Navigation buttons */}
                {/* <div className="flex justify-between mt-4"> */}
                <div className="flex flex-col items-center mt-6 gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-max px-10 py-2.5 rounded-lg font-semibold text-white text-base transition-colors duration-200 cursor-pointer"
                    style={{
                      background: 'linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)',
                      boxShadow: '0 2px 8px 0 rgba(0,153,204,0.08)',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Sign Up'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 text-base"
                  >
                    Back
                  </button>
                </div>
                
              </form>
      </motion.div>
    )}
  </AnimatePresence>
      </div>
    </div>
  )
}

export default SignUpForm