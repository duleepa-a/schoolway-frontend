'use client';
import { useState } from 'react';
import {useRouter} from 'next/navigation';


const SignupForm = () => {
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
    } else if (!/^\d{10,}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid contact number';
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

  return (
    <div>
      <h1>User Registration</h1>
      <p>Step {currentStep} of 2</p>
      
      {currentStep === 1 && (
        <div>
          <h2>Personal Information</h2>
          
          <div>
            <label htmlFor="firstName">First Name:</label>
            <br />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="signup-form-field"
            />
            {errors.firstName && <div style={{color: 'red'}}>{errors.firstName}</div>}
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <br />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="signup-form-field"
            />
            {errors.lastName && <div style={{color: 'red'}}>{errors.lastName}</div>}
          </div>
          <br />

          <div>
            <label htmlFor="email">Email:</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="signup-form-field"
            />
            {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
          </div>
          <br />

          <div>
            <label htmlFor="password">Password:</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="signup-form-field"
            />
            {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
          </div>
          <br />

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <br />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="signup-form-field"
            />
            {errors.confirmPassword && <div style={{color: 'red'}}>{errors.confirmPassword}</div>}
          </div>
          <br />
            <button onClick={handleNext} disabled={userExists} className = {userExists?"bg-blue-100 p-2 px-4 rounded-lg text-gray-500":"bg-blue-500 p-2 px-4 rounded-lg"}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Service Information</h2>
          
          <div>
            <label htmlFor="serviceName">Service Name:</label>
            <br />
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              required
            />
            {errors.serviceName && <div style={{color: 'red'}}>{errors.serviceName}</div>}
          </div>
          <br />

          <div>
            <label htmlFor="contactNumber">Contact Number:</label>
            <br />
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
            {errors.contactNumber && <div style={{color: 'red'}}>{errors.contactNumber}</div>}
          </div>
          <br />

          <div>
            <label htmlFor="serviceRegistrationNumber">Service Registration Number:</label>
            <br />
            <input
              type="text"
              id="serviceRegistrationNumber"
              name="serviceRegistrationNumber"
              value={formData.serviceRegistrationNumber}
              onChange={handleInputChange}
              required
            />
            {errors.serviceRegistrationNumber && <div style={{color: 'red'}}>{errors.serviceRegistrationNumber}</div>}
          </div>
          <br />

          <button onClick={handleBack}>Back</button>
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SignupForm;