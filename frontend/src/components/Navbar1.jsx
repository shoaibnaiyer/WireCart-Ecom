/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Hidden from '@mui/material/Hidden';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

function Navbar1() {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [numItemsInCart, setNumItemsInCart] = useState(0);
    const [numItemsInFavorites, setNumItemsInFavorites] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = async () => {
            setIsUserSignedIn(!!localStorage.getItem('token'));
            setUserData(JSON.parse(localStorage.getItem('userData')));
        };

        handleStorageChange();

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isUserSignedIn && userData?.userId) {
                    const cartItemsResponse = await axios.get(`http://localhost:3001/carts/items/${userData.userId}`);
                    const favoritesResponse = await axios.get(`http://localhost:3001/favorites/items/${userData.userId}`);
                    setNumItemsInCart(cartItemsResponse.data.cartProducts.length);
                    setNumItemsInFavorites(favoritesResponse.data.favoriteProducts.length);
                }
            } catch (error) {
                console.error('Error fetching cart and favorites:', error);
            }
        };

        fetchData();
    }, [isUserSignedIn, userData]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setIsUserSignedIn(false);
        setUserData(null);
        navigate('/login-customer');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'flex' },
                        // flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                            color: 'black',
                            textDecoration: 'overline',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s, color 0.3s, text-decoration 0.3s',
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                    }}
                >
                    WireCart
                </Typography>

                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isUserSignedIn && userData?.userType === 'Customer' && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box mr={2}>
                            <Badge badgeContent={numItemsInFavorites} color="secondary" component={Link} to="/favorites">
                                <FavoriteIcon style={{ color: 'white' }} />
                            </Badge>
                        </Box>
                        <Box mr={2}>
                            <Badge badgeContent={numItemsInCart} color="secondary" component={Link} to="/cart">
                                <ShoppingCartIcon style={{ color: 'white' }} />
                            </Badge>
                        </Box>
                    </Box>
                )}
                    <Hidden smUp>
                        <Button
                            color="inherit"
                            aria-controls="menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            <MenuIcon />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {isUserSignedIn ? (
                                [
                                    <MenuItem key="home" onClick={handleMenuClose} component={Link} to="/home">Home</MenuItem>,
                                    userData.userType === 'Customer' ? (
                                        <MenuItem key="customer-dashboard" onClick={handleMenuClose} component={Link} to="/customer-dashboard">Customer Dashboard</MenuItem>
                                    ) : (
                                        <MenuItem key="admin-dashboard" onClick={handleMenuClose} component={Link} to="/admin-dashboard">Admin Dashboard</MenuItem>
                                    ),
                                    <MenuItem key="sign-out" onClick={() => { handleMenuClose(); handleSignOut(); }} component={Link} to="/login-customer">Sign Out</MenuItem>
                                ]
                            ) : (
                                [
                                    <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login-customer">Login</MenuItem>,
                                    <MenuItem key="register" onClick={handleMenuClose} component={Link} to="/register1">Register</MenuItem>
                                ]
                            )}
                        </Menu>
                    </Hidden>

                    <Hidden smDown>
                        {isUserSignedIn ? (
                            <>
                                <Box>
                                    <Button color="inherit" component={Link} to="/home">
                                        Home
                                    </Button>
                                    {userData?.userType === 'Customer' ? (
                                <Button color="inherit" component={Link} to="/customer-dashboard">Customer Dashboard</Button>
                            ) : (
                                <Button color="inherit" component={Link} to="/admin-dashboard">Admin Dashboard</Button>
                            )}
                                    <Button color="inherit" onClick={handleSignOut} component={Link} to="/login-customer" startIcon={<ExitToAppIcon />}>
                                        Sign Out
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box>
                                    <Button color="inherit" component={Link} to="/login-customer">
                                        Login
                                    </Button>
                                    <Button color="inherit" component={Link} to="/register1">
                                        Register
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Hidden>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar1;
