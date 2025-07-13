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
      className="bg-left bg-no-repeat bg-cover py-12 justify-items-end"
      style={{ backgroundImage: 'url("../illustrations/loginBackground.png")' }}
    >
      <div className="max-w-md bg-white rounded-xl shadow-xl mr-10 p-10 ">
          <h2 className="text-2xl font-bold text-center mb-2">Log in to Your Account</h2>
          <p className="text-gray-500 text-center mb-6">Welcome back! Choose your preferred sign-in method.</p>
          {errors.credentials && <div style={{color: 'red'}}>{errors.credentials}</div>}
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-md border-gray-300 border focus:border-primary"
              />
              {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
              {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
              <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
            </div>

            <button onClick={handleLogin} disabled={isLoading} className="form-btn-full-width">
              {isLoading ? 'Logging in...' : 'Login'}
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

