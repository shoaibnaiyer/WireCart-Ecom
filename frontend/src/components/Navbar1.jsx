/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Hidden from '@mui/material/Hidden';

function Navbar1() {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsUserSignedIn(!!localStorage.getItem('token'));
            setUserData(JSON.parse(localStorage.getItem('userData')));
        };

        // Set initial state
        handleStorageChange();

        // Listen for changes in local storage
        window.addEventListener('storage', handleStorageChange);

        // Cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setIsUserSignedIn(false);
        setUserData(null);
        navigate('/login');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        WireCart
                    </Link>
                </Typography>

                <Hidden mdUp>
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
      <MenuItem key="sign-out" onClick={() => { handleMenuClose(); handleSignOut(); }} component={Link} to="/login">Sign Out</MenuItem>
    ]
  ) : (
    [
      <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login">Login</MenuItem>,
      <MenuItem key="register" onClick={handleMenuClose} component={Link} to="/register">Register</MenuItem>
    ]
  )}
</Menu>

                </Hidden>

                <Hidden smDown>
                    {isUserSignedIn ? (
                        <>
                            <Button color="inherit" component={Link} to="/home">Home</Button>
                            {userData?.userType === 'Customer' ? (
                                <Button color="inherit" component={Link} to="/customer-dashboard">Customer Dashboard</Button>
                            ) : (
                                <Button color="inherit" component={Link} to="/admin-dashboard">Admin Dashboard</Button>
                            )}
                            <Button color="inherit" onClick={handleSignOut} startIcon={<ExitToAppIcon />}>Sign Out</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar1;