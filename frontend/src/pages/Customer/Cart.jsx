/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.userId) {
          console.error('User ID not found in local storage');
          return;
        }

        const response = await axios.get(`http://localhost:3001/carts/items/${userData.userId}`);
        console.log("Here",response.data)
        setCartItems(response.data.cartProducts || []); // Ensure response.data is not undefined
        console.log('Cart items:', response.data); // Log the fetched cart items
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]); // Set cartItems to empty array in case of error
      }
    }

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      await axios.delete(`http://localhost:3001/carts/delete-item/${productId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      // Remove the deleted item from the cartItems state
      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
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
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.cartQty}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleRemoveFromCart(item.product._id)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No items in cart</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default Cart;