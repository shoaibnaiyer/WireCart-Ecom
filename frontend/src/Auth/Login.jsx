/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Customer'
    })

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
        }
    }
    

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('http://localhost:3001/login', formData)
    //         const token = response.data.token
    //         // const uesrType = response.data.userType
    //         const userData = {
    //             userId: response.data.userId,
    //             userType: response.data.userType,
    //         }
    //         localStorage.setItem('token', token);
    //         localStorage.setItem('userData', JSON.stringify(userData));
    //         alert("Login Successful")
    //         // setFormData({
    //         //     email: '',
    //         //     password: '',
    //         //     role: 'Customer',
    //         // });
    //         // fetchUsers();
    //         const { role } = formData;
    //         switch (role) {
    //             case 'Customer':
    //                 navigate('/customer-dashboard');
    //                 break;
    //             case 'Seller':
    //                 navigate('/seller-dashboard');
    //                 break;
    //             case 'Admin':
    //                 navigate('/admin-dashboard');
    //                 break;
    //             default:
    //                 navigate('/login');
    //         }
    //         window.location.reload()
    //         // localStorage.setItem('token', token)
    //         // localStorage.setItem("userData", JSON.stringify(userData));
    //     } catch (error) {
    //         console.error("Error logging in", error)
    //     }
    // }

    return (
        <Container className="login-container" >
            <div className="login-box">
                <h2>Login</h2>
                <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Group controlId="email">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="role">
                        <Form.Label>Login As:</Form.Label>
                        <Form.Control as="select" name="role" value={formData.role} onChange={handleChange}>
                            <option value="Customer">Customer</option>
                            <option value="Seller">Seller</option>
                            <option value="Admin">Admin</option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="login-button">
                        Login
                    </Button>
                    <div className="mt-3">
                        New User? <Link to="/register">Click here to Register</Link>
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default Login;
