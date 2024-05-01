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
  Tooltip,
  TablePagination,
  Grid // Import Grid for layout
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [page, setPage] = useState(0); // Add state for page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Add state for rowsPerPage
  const [totalCartAmount, setTotalCartAmount] = useState(0); // State for total cart amount

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

    fetchCartItems();
  }, []);

  // Calculate total cart amount
  useEffect(() => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });
    setTotalCartAmount(totalAmount);
  }, [cartItems]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
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
                  <TableCell><b>Total Price</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate the cart items
                  .map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.product.description}</TableCell>
                      <TableCell>{item.product.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.product.price * item.quantity}</TableCell>
                      <TableCell>
                        <Tooltip title="Remove">
                          <IconButton aria-label="remove">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            component="div"
            count={cartItems.length} // Total number of items
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Grid container direction="column" alignItems="flex-end" style={{ marginTop: '20px' }}>
          <Typography variant="h5">
            <b>Total Cart Amount:</b> ₹{totalCartAmount.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: '10px',
              width: '200px',
              height: '50px',
              fontSize: '1.2rem'
            }}
          >
            Place Order
          </Button>
        </Grid>

      </Container>
    </>
  );
}

export default Cart;
