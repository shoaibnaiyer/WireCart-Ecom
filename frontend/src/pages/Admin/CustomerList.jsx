/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    role: ''
  });

  const columns = [
    { id: 'serial', name: 'S. No.' },
    { id: 'name', name: 'Name' },
    { id: 'email', name: 'Email' },
    { id: 'address', name: 'Address' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'role', name: 'Role' },
    { id: 'actions', name: 'Actions' }
  ]

  const handleChangePage = (event, newpage) => {
    pageChange(newpage)
  }

  const handleRowsPerPage = (event) => {
    rowPerPageChange(+event.target.value)
    pageChange(0)
  }

  const [rows, rowChange] = useState([]);
  const [page, pageChange] = useState(0);
  const [rowperpage, rowPerPageChange] = useState(5);

  useEffect(() => {
    // Fetch customer data from the server
    axios.get('http://localhost:3001/register')
      .then((res) => {
        setCustomers(res.data); // Set the fetched customer data in state
        console.log(res.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once, on component mount

  const handleDelete = (customerId) => {
    setSelectedCustomer(customers.find(customer => customer._id === customerId));
    setDeleteModalOpen(true);
  };

  const handleUpdate = (customerId) => {
    // Fetch the customer details by ID and implement update logic
    const customerToUpdate = customers.find(customer => customer._id === customerId);
    setNewCustomer(customerToUpdate);
    setEditModalOpen(true);
  };

  const handleDeleteConfirmation = () => {
    axios.delete(`http://localhost:3001/user/${selectedCustomer._id}`)
      .then(() => {
        // Filter out the deleted customer from the list
        setCustomers(customers.filter(customer => customer._id !== selectedCustomer._id));
        setDeleteModalOpen(false);
      })
      .catch(error => {
        console.error('Error deleting customer:', error);
      });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleUpdateCustomer = () => {
    axios.put(`http://localhost:3001/user/${selectedCustomer._id}`, newCustomer)
      .then(() => {
        // Update the customer in the list
        setCustomers(customers.map(customer => {
          if (customer._id === selectedCustomer._id) {
            return { ...customer, ...newCustomer };
          }
          return customer;
        }));
        handleCloseEditModal();
      })
      .catch(error => {
        console.error('Error updating customer:', error);
      });
  };


  return (
    <>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Customer List</Typography>
        </Box>
        <Paper>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {/* <TableCell><b>Serial No.</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
                <TableCell><b>User Type</b></TableCell>
                <TableCell><b>Actions</b></TableCell> */}
                  {columns.map((column) => (
                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} key={column.id}><b>{column.name}</b></TableCell>
                  )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {customers
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((customer, index) => (
                    <TableRow key={customer._id}>
                      <TableCell><b>{index + 1}</b></TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>{customer.role}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton aria-label="edit" onClick={() => handleUpdate(customer._id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete" onClick={() => handleDelete(customer._id)}>
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
            rowsPerPageOptions={[5, 10, 15]}
            rowsPerPage={rowperpage}
            page={page}
            count={customers.length}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          />
        </Paper>
        <Modal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Delete Customer
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this customer?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="error" onClick={handleDeleteConfirmation} sx={{ marginRight: 2 }}>Yes</Button>
              <Button variant="contained" onClick={handleCloseDeleteModal}>No</Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Edit Customer
            </Typography>
            <TextField
              label="Name"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={newCustomer.mobile}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              name="role"
              value={newCustomer.role}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleUpdateCustomer}>Update Customer</Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
}

export default CustomerList;
