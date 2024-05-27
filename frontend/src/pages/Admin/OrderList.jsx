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
  Select,
  MenuItem,
  Modal,
  Box,
  Button
} from '@mui/material';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/orders`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdateOrder = async (orderId, updateData) => {
    try {
      const orderToUpdate = orders.find(order => order._id === orderId);
      if (!orderToUpdate) {
        console.error('Order not found');
        return;
      }

      // Update delivery date to current date if status is "Delivered"
      if (updateData.status === "Delivered") {
        updateData.deliveryDate = new Date().toISOString().split('T')[0];
      }

      const userId = orderToUpdate.user._id;
      await axios.put(`http://localhost:3001/users/${userId}/orders/${orderId}`, updateData);
      // Refetch orders after updating
      fetchOrders();
      console.log("Successfully Updated");
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };


  const handleViewDetails = async (orderId) => {
    try {
      const userId = orders.find(order => order._id === orderId).user._id;
      const response = await axios.get(`http://localhost:3001/users/${userId}/orders/${orderId}`);
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
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Order List</Typography>
        </Box>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: 'black', color: 'white' }}>
                  <TableCell style={{ color: 'inherit' }}><b>S. No.</b></TableCell>
                  <TableCell style={{ color: 'inherit' }}><b>Order ID</b></TableCell>
                  {/* <TableCell style={{ color: 'inherit' }}><b>User ID</b></TableCell> */}
                  <TableCell style={{ color: 'inherit' }}><b>User Name</b></TableCell>
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
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>
                        {order.status === "Delivered" ? (
                          // Show delivery date if status is "Delivered"
                          new Date(order.deliveryDate).toLocaleDateString('en-GB')
                        ) : (
                          "Item not delivered"
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onChange={(event) => handleUpdateOrder(order._id, { status: event.target.value })}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </TableCell>
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
              maxWidth: '200vw',
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
                      <TableRow style={{ backgroundColor: 'black', color: 'white' }} >
                        <TableCell style={{ color: 'inherit' }}><b>Product Name</b></TableCell>
                        <TableCell style={{ color: 'inherit' }}><b>Quantity</b></TableCell>
                        <TableCell style={{ color: 'inherit' }}><b>Price</b></TableCell>
                        <TableCell style={{ color: 'inherit' }}><b>Total Price</b></TableCell>
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
      </Container >
    </>
  );
}

export default OrderList;
