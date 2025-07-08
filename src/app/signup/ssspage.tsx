'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
signIn

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface VanServiceFormData {
  serviceName: string;
  contactNo: string;
  profilePhoto: File | null;
  businessLicense: File | null;
}
const Signup=() => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [vanServiceFormData, setVanServiceFormData] = useState<VanServiceFormData>({
    serviceName: '',
    contactNo: '',
    profilePhoto: null,
    businessLicense: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleVanServiceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setVanServiceFormData({ ...vanServiceFormData, [name]: files[0] });
    } else {
      setVanServiceFormData({ ...vanServiceFormData, [name]: value });
    }
  };

  const handleNext = () => {
    if (!userFormData.firstName || !userFormData.lastName || !userFormData.email || !userFormData.password) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vanServiceFormData.serviceName || !vanServiceFormData.contactNo) {
      setError('Please fill out all required fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', userFormData.firstName);
      formData.append('lastName', userFormData.lastName);
      formData.append('email', userFormData.email);
      formData.append('password', userFormData.password);
      formData.append('serviceName', vanServiceFormData.serviceName);
      formData.append('contactNo', vanServiceFormData.contactNo);
      if (vanServiceFormData.profilePhoto) {
        formData.append('profilePhoto', vanServiceFormData.profilePhoto);
      }
      if (vanServiceFormData.businessLicense) {
        formData.append('businessLicense', vanServiceFormData.businessLicense);
      }
      const res = await fetch('/api/signup', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed.');
        setLoading(false);
        return;
      }
      router.push('/success');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1><Link href="/api/auth/signin">Login with google account</Link>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 1 ? (
            <>
          <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={userFormData.firstName}
                onChange={handleUserFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userFormData.lastName}
                onChange={handleUserFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleUserFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={userFormData.password}
                onChange={handleUserFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              Next
            </button>
            
          </form>
        
          <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center w-full border border-gray-300 hover:bg-gray-100 rounded-md px-4 py-2 text-sm font-medium"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
          </button></>
          
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="text-lg font-semibold mb-4">Van Service Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={vanServiceFormData.serviceName}
                onChange={handleVanServiceFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="contactNo"
                value={vanServiceFormData.contactNo}
                onChange={handleVanServiceFormChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Profile Photo (Optional)</label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleVanServiceFormChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Business License (Optional)</label>
              <input
                type="file"
                name="businessLicense"
                accept=".pdf,.jpg,.png"
                onChange={handleVanServiceFormChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
}

export default Signup;
