'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      console.log("erro is ",error);
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
    <>
    <div className="flex w-3/4  bg-primary h-4/5 justify-between rounded-br-2xl rounded-tr-2xl rounded-2xl">
      {/* Left side - Yellow background with logo */}
      <div className="hidden lg:block overflow-hidden justify-items-center pl-20 pt-4">
        <Image
        src={'/logo/Logo_light.svg'}
        alt='schoolway logo'
        width={200}
        height={200}
        />
        <h1 className='mt-10 m-0'>add some description over here</h1>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center h-min">
        <div className="w-full ">
          <div className="bg-white rounded-2xl shadow-xl pt-14 pl-14 pr-7 pb-7 ">
          <AnimatePresence mode="wait">
    {currentStep === 1 && (
      <motion.div
        key="step1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >
        <div className='flex justify-start'>
                <h2 className="text-lg font-semibold text-active-text text-center mb-2.5">
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
              <div className='w-full flex justify-center'>
                <button
                  type="button"
                  onClick={handleNext} disabled={userExists}
                  className={!userExists?"w-max bg-black hover:bg-active-text text-white font-semibold px-18 py-2.5 rounded-xs transition-colors duration-200  cursor-pointer text-sm":"w-max bg-gray-600  text-gray-400 font-semibold px-18 py-2.5 rounded-xs  duration-200  cursor-pointer text-sm"}
                >
                  Proceed
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
                // onClick={handleGoogleSignUp}
                className="submit-bttn"
              >
                
                <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
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
        <div className='flex justify-start'>
                <h2 className="text-lg font-semibold text-active-text text-center mb-2.5">
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
                <div className="flex flex-col items-center mt-4 space-y-2">
                  
                  <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-max bg-black hover:bg-active-text text-white font-semibold px-18 py-2.5 rounded-xs transition-colors duration-200  cursor-pointer text-sm"
                  >
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                  </button>
                  <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xs transition-colors duration-200 text-sm"
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
      </div>
    </div>
</>
  )
}

export default SignUpForm