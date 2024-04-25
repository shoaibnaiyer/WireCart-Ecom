/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/marsRover.jpg';

function LoginCustomer() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Customer' // Default role set to Customer
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        function isLoggedIn() {
            const userData = localStorage.getItem("userData");
            if (userData) {
                navigate("/home");
            }
        }
        isLoggedIn();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', formData)
            const token = response.data.token
            const userData = {
                userId: response.data.userId,
                userType: response.data.userType,
            }
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            alert("Login Successful")

            // Dispatch a custom event here
            window.dispatchEvent(new Event('storage'));

            navigate('/customer-dashboard'); // Directly navigate to customer dashboard
        } catch (error) {
            console.error("Error logging in", error)
            setErrorMessage(error.response.data.message || 'An error occurred during login');
        }
    }

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Login
                    </Typography>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Typography variant="body2" align="center">
                           <div>New User? <Link to="/register1">Click here to Register</Link></div>
                           <div>Admin? <Link to="/login-admin">Click here to go to Admin Login</Link></div>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default LoginCustomer;
