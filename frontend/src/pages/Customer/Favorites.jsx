/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    Snackbar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MuiAlert from '@mui/material/Alert';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.userId) {
                    console.error('User ID not found in local storage');
                    return;
                }

                const response = await axios.get(`http://localhost:3001/favorites/items/${userData.userId}`);
                setFavorites(response.data.favoriteProducts || []);
            } catch (error) {
                console.error('Error fetching favorite items:', error);
                setFavorites([]);
            }
        }

        async function fetchCartItems() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.userId) {
                    console.error('User ID not found in local storage');
                    return;
                }

                const response = await axios.get(`http://localhost:3001/carts/items/${userData.userId}`);
                setCartItems(response.data.cartProducts || []);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
            }
        }

        fetchFavorites();
        fetchCartItems();
    }, []);

    const handleRemoveFromFavorites = async (productId) => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.userId) {
                console.error('User ID not found in local storage');
                return;
            }

            await axios.delete(`http://localhost:3001/favorites/remove-product/${userData.userId}/${productId}`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            });

            setFavorites(favorites.filter(item => item._id !== productId));
            setSnackbarSeverity('success');
            setSnackbarMessage('Removed from favorites');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error removing item from favorites:', error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData.userId) {
                console.error('User ID not found in local storage');
                return;
            }

            const productInCart = cartItems.find(item => item.product._id === productId);
            if (productInCart) {
                setSnackbarSeverity('warning');
                setSnackbarMessage('Already in cart');
                setSnackbarOpen(true);
                return;
            }

            await axios.post(`http://localhost:3001/carts/add-product`, { userId: userData.userId, productId, quantity: 1 }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            });

            const updatedCart = await axios.get(`http://localhost:3001/carts/items/${userData.userId}`);
            setCartItems(updatedCart.data.cartProducts);
            setSnackbarSeverity('success');
            setSnackbarMessage('Added to cart');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Favorite Items</Typography>
            </Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: 'black', color: 'white' }}>
                                <TableCell style={{ color: 'inherit' }}><b>S. No.</b></TableCell>
                                <TableCell style={{ color: 'inherit' }}><b>Name</b></TableCell>
                                <TableCell style={{ color: 'inherit' }}><b>Description</b></TableCell>
                                <TableCell style={{ color: 'inherit' }}><b>Price</b></TableCell>
                                <TableCell style={{ color: 'inherit' }}><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {favorites
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>
                                            <IconButton aria-label="Remove from Favorites" onClick={() => handleRemoveFromFavorites(item._id)}>
                                                <FavoriteIcon color="error" />
                                            </IconButton>
                                            {cartItems.some(cartItem => cartItem.product._id === item._id) ? (
                                                <Button variant="outlined" style={{ marginTop: '10px' }} disabled>Already in Cart</Button>
                                            ) : (
                                                <Button variant="outlined" style={{ marginTop: '10px' }} onClick={() => handleAddToCart(item._id)}>Add to Cart<AddShoppingCartIcon /></Button>
                                            )}

                                            {/* <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleAddToCart(item._id)}
                                                    disabled={cartItems.some(cartItem => cartItem.product._id === item._id)}
                                                >
                                                    {cartItems.some(cartItem => cartItem.product._id === item._id) ? 'Already in Cart' : 'Add to Cart'}
                                                    <AddShoppingCartIcon />
                                                </Button> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={favorites.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={{ marginTop: '50px' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default Favorites;
