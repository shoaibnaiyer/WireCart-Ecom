/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Register.css'

function Register() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        mobile: '',
        password: '',
        role: 'Customer',
    });

    const navigate = useNavigate()

    // const navigate = useNavigate();

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
        axios.post('http://localhost:3001/register', formData)
            // .then(result => {console.log(result)
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
                navigate('/login')
            }).catch((error) => {
                console.log("Unable to register user")
            })
    };
    return (
        <>
            <Container className="register-container">
                <div className="register-box">
                    <h2>Register</h2>
                    <Form className="register-form" onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" name="name" value={formData.name} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter your address" name="address" value={formData.address} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="mobile">
                            <Form.Label>Mobile No</Form.Label>
                            <Form.Control type="text" placeholder="Enter your mobile number" name="mobile" value={formData.mobile} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" name="password" value={formData.password} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="role">
                            <Form.Label>User Type</Form.Label>
                            <Form.Control as="select" name="role" value={formData.role} onChange={handleChange}>
                                <option value="Customer">Customer</option>
                                <option value="Seller">Seller</option>
                                <option value="Admin">Admin</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="register-button">
                            Register
                        </Button>
                        <div className="mt-3">
                            Already have an account? <Link to="/login">Login here</Link>
                        </div>
                    </Form>
                </div>
            </Container>
        </>
    )
}

export default Register


