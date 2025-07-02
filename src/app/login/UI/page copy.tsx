'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Client } from '@neondatabase/serverless';



export default function LLogin() {
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className=" bg-left bg-no-repeat py-12 justify-items-end" 
          style={{backgroundImage: 'url("./illustrations/loginBackground.png")'}}
    >
      <div className="max-w-md bg-white rounded-xl shadow-xl mr-10 p-10 ">
          <h2 className="text-2xl font-bold text-center mb-2">Log in to Your Account</h2>
          <p className="text-gray-500 text-center mb-6">Welcome back! Choose your preferred sign-in method.</p>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 rounded-md border-gray-300 border focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  className="mt-1 w-full px-4 py-2 rounded-md border-gray-300 border focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
              <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
            </div>

            <button className="form-btn-full-width">
              Sign In
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center gap-4">
            <button className="bg-white  rounded-full cursor-pointer">
              <Image src="/Images/google.svg" alt="Google" width={24} height={24} />
            </button>
          </div>
        </div>
    </div>
  );
}

export default LoginPage;