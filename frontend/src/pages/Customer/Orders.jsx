/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Modal,
  Box,
  Button
} from '@mui/material';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch orders for the logged-in user
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      const response = await axios.get(`http://localhost:3001/users/${userData.userId}/orders`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        console.error('User ID not found in local storage');
        return;
      }

      const response = await axios.get(`http://localhost:3001/users/${userData.userId}/orders/${orderId}`);
      setSelectedOrder(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Order History</Typography>
        </Box>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: 'black', color: 'white' }} >
                  <TableCell style={{ color: 'inherit' }}><b>S. No.</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Order ID</b></TableCell>
                  {/* <TableCell><b>User ID</b></TableCell> */}
                  <TableCell style={{ color: 'inherit' }}><b>User Name</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Delivery Address</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Total Amount</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Order Date</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Expected Delivery Date</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Delivery Date</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Status</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => (
                    <TableRow key={order._id}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{order._id}</TableCell>
                      {/* <TableCell>{order.user._id}</TableCell> */}
                      <TableCell>{order.user.name}</TableCell>
                      <TableCell>{order.deliveryAddress}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>
                        {order.status === "Delivered" ? (
                          new Date(order.deliveryDate).toLocaleDateString('en-GB')
                        ) : (
                          "Item not delivered"
                        )}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleViewDetails(order._id)} variant="contained" color="primary">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              maxHeight: '80vh',
              overflowY: 'auto',
              maxWidth: '90vw',
            }}
          >
            {selectedOrder && (
              <div>
                <h3>Order Details</h3>
                <p style={{ margin: '4px 0' }}>Order ID: {selectedOrder._id}</p>
                <p style={{ margin: '4px 0' }}>User ID: {selectedOrder.user._id}</p>
                <p style={{ margin: '4px 0' }}>User Name: {selectedOrder.user.name}</p>
                <p style={{ margin: '4px 0' }}>User Address: {selectedOrder.user.address}</p>
                <p style={{ margin: '4px 0' }}>Total Amount: {selectedOrder.totalAmount}</p>
                <p style={{ margin: '4px 0' }}>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p style={{ margin: '4px 0' }}>Expected Delivery Date: {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()}</p>
                <p style={{ margin: '4px 0' }}>Delivery Date: {selectedOrder.deliveryDate}</p>
                <p style={{ margin: '4px 0' }}>Status: {selectedOrder.status}</p>
                <h3>Order Items</h3>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Product Name</b></TableCell>
                        <TableCell><b>Quantity</b></TableCell>
                        <TableCell><b>Price</b></TableCell>
                        <TableCell><b>Total Price</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.products.map(item => (
                        <TableRow key={item.product._id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.product.price}</TableCell>
                          <TableCell>{item.product.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                  p={2}
                >
                  <Typography variant="h6">Total Amount: <span><b>₹{selectedOrder.products.reduce((total, item) => total + item.product.price * item.quantity, 0)}</b></span>
                  </Typography>
                </Box>

              </div>
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
}

export default Orders;
