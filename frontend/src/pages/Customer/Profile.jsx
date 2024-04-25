/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  // TableHead,
  TableRow,
  Paper
} from '@mui/material';


function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userUpdated, setUserUpdated] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    mobile: ''
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.userId) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(`http://localhost:3001/user/${userData.userId}`);
        setUserDetails(response.data);
        setUserUpdated(false)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userUpdated]);

  const handleOpenModal = () => {
    setNewUser({ ...userDetails });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleUpdateUser = () => {
    axios.put(`http://localhost:3001/user/${userDetails._id}`, newUser)
      .then(() => {
        setUserDetails(newUser);
        setUserUpdated(true);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>User Details</Typography>
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={handleOpenModal}>Edit Info</Button>
        </Box>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table aria-label="user-details-table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row"><b>Name:</b></TableCell>
                  <TableCell>{userDetails.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"><b>Email:</b></TableCell>
                  <TableCell>{userDetails.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"><b>Address:</b></TableCell>
                  <TableCell>{userDetails.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"><b>Mobile:</b></TableCell>
                  <TableCell>{userDetails.mobile}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
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
              Edit User Deatails
            </Typography>
            <TextField
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={newUser.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={newUser.mobile}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleUpdateUser}>Save Updated Info</Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
}

export default Profile;
