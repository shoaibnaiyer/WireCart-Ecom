/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/marsRover.jpg';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Customer'
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        function isLoggedIn() {
            const userData = localStorage.getItem("userData");
            console.log("Here in use effect");
            if (userData) {
                navigate("/home");
            }
        }
        isLoggedIn();
        fetchUsers();
    }, [navigate]);

    const fetchUsers = () => {
        axios
            .get('http://localhost:3001/register')
            .then((res) => {
                console.log(res.data);
            })
            .catch((error) => {
                console.log('Error fetching users:', error);
            });
    };

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

            const { role } = formData;
            switch (role) {
                case 'Customer':
                    navigate('/customer-dashboard');
                    break;
                case 'Seller':
                    navigate('/seller-dashboard');
                    break;
                case 'Admin':
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/login');
            }
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
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="role-label">Login As</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={formData.role}
                                label="Login As"
                                name="role"
                                onChange={handleChange}
                            >
                                <MenuItem value="Customer">Customer</MenuItem>
                                <MenuItem value="Seller">Seller</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Typography variant="body2" align="center">
                            New User? <Link to="/register">Click here to Register</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;