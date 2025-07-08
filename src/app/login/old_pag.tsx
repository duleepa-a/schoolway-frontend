'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSession } from "next-auth/react";


// const session = await getSession();
// if (session) {
//   console.log("User is authenticated:", session.user);
// } else {
//   console.log("User is not authenticated");
// }

type Errors = {
  email?: string;
  password?: string;
  credentials?:String;
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
const newErrors :Errors = {};
console.log(formData);

// await new Promise(resolve => setTimeout(resolve, 3000));
      const handleSignIn = async (data : {email:String, password:String}) => {
        
        const signInData  = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect:false,
        });

        console.log("clicekd2");
// console.log(signInData);
// }
        if(signInData?.status===401){
          console.log("Error is : ", signInData)
          // show the credentials are wrong
          
          newErrors.credentials = 'Your credentials do not seem to match with ours';
          setErrors(newErrors);
        }else{
          console.log("User Logged in!");
          
        // Reset form
        setFormData({
          email: '',
          password: ''
        });

          router.push("/");
        }
      };
      const signInData_ = await handleSignIn(formData);
      


      // const data = await response.json();

      // if (response.ok) {
      //   alert('Login successful!');
        // Store token or user data if needed
        // localStorage.setItem('token_yo', data.token); // if using JWT
        // localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home page
        // console.log('User logged in:', data.user);
        

      // } else {
      //   alert(`Login failed: ${data.message || 'Invalid credentials'}`);
      // }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Login</h1>
      {errors.credentials && <div style={{color: 'red'}}>{errors.credentials}</div>}
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
        />
        {errors.password && <div style={{color: 'red'}}>{errors.password}</div>}
      </div>
      <br />

      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      
      <br />
      <br />
      <div>
        <a href="/signup">Don't have an account? Sign up here</a>
      </div>
    </main>
  );
}

export default LoginPage;