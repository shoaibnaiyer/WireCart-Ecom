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
  Modal,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userDetails, setUserDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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

    async function fetchUserDetails() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.userId) {
          console.error('User ID not found in local storage');
          return;
        }

        const response = await axios.get(`http://localhost:3001/user/${userData.userId}`);
        setUserDetails(response.data);
        setDeliveryAddress(response.data.address); // Assuming address is in the user details
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchCartItems();
    fetchUserDetails();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      await axios.delete(`http://localhost:3001/carts/remove-product/${userData.userId}/${productId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      await axios.put(`http://localhost:3001/carts/update-quantity/${userData.userId}/${productId}`, {
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      const updatedCartItems = cartItems.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = () => {
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePlaceOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      const currentDate = new Date();
      const expectedDeliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 7))

      const orderData = {
        user: userData.userId,
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
        deliveryAddress: deliveryAddress,
        expectedDeliveryDate: expectedDeliveryDate.toISOString().split('T')[0]
      };

      await axios.post(`http://localhost:3001/users/${userData.userId}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      // Clear the cart items from the database
      await axios.delete(`http://localhost:3001/carts/delete-all-items`, {
        data: { userId: userData.userId },
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      setCartItems([]);
      setOpenModal(false);

      navigate('/orders');

      console.log('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Cart Items</Typography>
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'black', color: 'white' }} >
                <TableCell style={{ color: 'inherit' }}><b>S. No.</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Name</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Description</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Price</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Quantity</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Total Price</b></TableCell>
                <TableCell style={{ color: 'inherit' }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={item.product._id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.description}</TableCell>
                    <TableCell>{item.product.price}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Remove"
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      {item.quantity}
                      <IconButton
                        aria-label="Add"
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{item.product.price * item.quantity}</TableCell>
                    <TableCell>
                      <IconButton aria-label="Delete" onClick={() => handleRemoveFromCart(item.product._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={cartItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        p={2}
      >
        <Typography variant="h6">
          Total Cart Amount: <b>₹{cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</b>
        </Typography>
        <Button variant="contained" color="primary" style={{ marginTop: '10px', marginBottom: '10px' }} onClick={handleCheckout}>
          Checkout
        </Button>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Total Cart Amount: {cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Items Count: {cartItems.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          {userDetails && (
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Name: {userDetails.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Email: {userDetails.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Mobile: {userDetails.mobile}
              </Typography>
              <TextField
                label="Delivery Address"
                variant="outlined"
                fullWidth
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
          )}
          <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default Cart;
