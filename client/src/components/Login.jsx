import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const endpoint = isRegistering 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await axios.post(endpoint, { email, password, role });
      setMessage(isRegistering ? 'Registration successful! Please login.' : 'Login successful!');
      
      if (!isRegistering) {
        // Save user role for UI controls like admin permissions
        localStorage.setItem('userRole', response.data.role);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setIsRegistering(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred. Please check your backend connection.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#1e1e2f', color: '#fff', borderRadius: '10px' }}>
      <h2>{isRegistering ? 'Register New Account' : 'Login'}</h2>
      {message && <p style={{ color: '#4fc3f7' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit"
          style={{ padding: '12px', backgroundColor: '#4fc3f7', color: '#1e1e2f', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#4fc3f7' }} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login here' : "Don't have an account? Register here"}
      </p>
    </div>
  );
}

export default Login;