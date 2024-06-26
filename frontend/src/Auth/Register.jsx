/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/marsRover.jpg';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        mobile: '',
        password: '',
        role: 'Customer',
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:3001/register', formData)
            .then(() => {
                alert('Registration Successful');
                setFormData({
                    name: '',
                    email: '',
                    address: '',
                    mobile: '',
                    password: '',
                    role: 'Customer',
                });
                fetchUsers();
                navigate('/login');
            })
            .catch((error) => {
                console.log('Unable to register user');
            });
    };

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
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="mobile"
                            label="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
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
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="role-label">User Type</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={formData.role}
                                label="User Type"
                                name="role"
                                onChange={handleChange}
                            >
                                <MenuItem value="Customer">Customer</MenuItem>
                                <MenuItem value="Seller">Seller</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                            Register
                        </Button>
                        <Typography variant="body2" align="center">
                            Already have an account? <Link to="/login">Login here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Register;