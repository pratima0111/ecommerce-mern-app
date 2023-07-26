import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth, // Spread the existing auth state object
          user: res.data.user, // Update the user property with the value from res.data.user
          token: res.data.token, // Update the token property with the value from res.data.token
        });
        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(location.state || '/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }
  };
  return (
    <Layout title={'Login- Ecommerce App'}>
      <div className='form-container '>
        <form onSubmit={handleSubmit}>
          <h4 className='title'>Log In </h4>

          <div className='mb-3'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control'
              placeholder='Enter Your Email '
              required
            />
          </div>
          <div className='mb-3'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control'
              placeholder='Enter Your Password'
              required
            />
          </div>
          <div className='mb-3'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => {
                navigate('/forgot-password');
              }}
            >
              Forgot Password
            </button>
          </div>

          <button type='submit' className='btn btn-primary'>
            Log In
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
