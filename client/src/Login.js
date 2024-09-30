// src/Login.js
import React, { useState } from 'react';
import './main.css';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                onLoginSuccess(); // Notify App component that login was successful
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>

            {/* Login Form */}
            <form id="loginForm" className="form-section" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    className="input-field"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit" className="button-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
