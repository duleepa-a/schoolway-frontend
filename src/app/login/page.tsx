'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Errors = {
  email?: string;
  password?: string;
  credentials?:String;
};


export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user starts typing
      if (errors[name as keyof Errors]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };
  
    const validateForm = () => {
    const newErrors :Errors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
      
      if (!validateForm()) {
        return;
      }
      setIsLoading(true);
      
      try {
        
        const newErrors :Errors = {};
        console.log(formData);
  
        const handleSignIn = async (data : {email:String, password:String}) => {
          
          const signInData  = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect:false,
          });
  
          if(signInData?.status===401){
            console.log("Error is : ", signInData)            
            newErrors.credentials = 'Your credentials do not seem to match with ours! Check again?';
            setErrors(newErrors);
          }else{

            const session = await fetch('/api/auth/session').then(res => res.json());
            const userRole = session?.user?.role;
            
            if (userRole === 'ADMIN') {
              router.push('/admin');
            } else if (userRole === 'SERVICE') {
              router.push('/vanowner');
            } else if (userRole === 'PARENT') {
              router.push('/parent');
            } else {
              router.push('/'); 
            }
            
            setFormData({
              email: '',
              password: ''
            });             
        }    
        };
        const signInData_ = await handleSignIn(formData);
    
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
  

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 mt-0.5"
      style={{ background: 'white' }}
    >
      <div
        className="max-w-md w-full rounded-xl p-10"
        style={{
          background: 'var(--color-textwhite)',
          color: 'var(--color-textblack)',
          boxShadow: '0 8px 32px 0 rgba(2, 151, 121, 0.15)'
        }}
      >
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--blue-shade-dark)' }}>Log in to Your Account</h2>
          <p className="text-center mb-6" style={{ color: 'var(--color-textgreydark)' }}>Welcome back! Choose your preferred sign-in method.</p>
          {errors.credentials && <div style={{color: 'red'}}>{errors.credentials}</div>}
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-textgreydark)' }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-md border"
                style={{
                  background: 'var(--color-background)',
                  color: 'var(--color-textblack)',
                  borderColor: 'var(--blue-shade-light)',
                  outline: 'none'
                }}
              />
              {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--color-textgreydark)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-4 py-2 rounded-md border"
                  style={{
                    background: 'var(--color-background)',
                    color: 'var(--color-textblack)',
                    borderColor: 'var(--blue-shade-light)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4"
                  style={{ color: 'var(--color-textgreylight)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2" style={{ color: 'var(--color-textgreydark)' }}>
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
              <a href="#" style={{ color: 'var(--blue-shade-dark)' }} className="hover:underline">Forgot password?</a>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-2 rounded-md font-semibold cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)',
                color: 'var(--color-textwhite)',
                border: 'none'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer and social login removed as requested */}
        </div>
    </div>
  );
}

