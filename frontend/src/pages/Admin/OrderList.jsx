import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
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
      const response = await axios.get(`http://localhost:3001/users/:userId/orders/${orderId}`);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Order ID</b></TableCell>
              <TableCell><b>User ID</b></TableCell>
              <TableCell><b>User Name</b></TableCell>
              <TableCell><b>Total Amount</b></TableCell>
              <TableCell><b>Order Date</b></TableCell>
              <TableCell><b>Expected Delivery Date</b></TableCell>
              <TableCell><b>Delivery Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user._id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={order.expectedDeliveryDate}
                      onChange={(event) => handleUpdateOrder(order._id, { expectedDeliveryDate: event.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={order.deliveryDate}
                      onChange={(event) => handleUpdateOrder(order._id, { deliveryDate: event.target.value })}
                    />
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
                    <button onClick={() => handleViewDetails(order._id)}>View Details</button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}>
          {selectedOrder && (
            <div>
              <h2>Order Details</h2>
              <p>Order ID: {selectedOrder._id}</p>
              <p>User ID: {selectedOrder.user._id}</p>
              <p>User Name: {selectedOrder.user.name}</p>
              <p>Total Amount: {selectedOrder.totalAmount}</p>
              <p>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              <p>Expected Delivery Date: {selectedOrder.expectedDeliveryDate}</p>
              <p>Delivery Date: {selectedOrder.deliveryDate}</p>
              <p>Status: {selectedOrder.status}</p>
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
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default OrderList;
