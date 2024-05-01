/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardActions, Button, Typography, CardMedia, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function TextRating({ value }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Rating
        name="text-feedback"
        value={value}
        readOnly
        precision={0.5}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      <span style={{ marginLeft: '8px' }}>
        {value} ({labels[value]})
      </span>
    </span>
  );
}


TextRating.propTypes = {
  value: PropTypes.number.isRequired,
};

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store the selected product
  const [openModal, setOpenModal] = useState(false); // State to control the modal open/close

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = async (productId) => {
    const userData = JSON.parse(localStorage.getItem('userData')); // Retrieve user data from localStorage
    if (!userData || !userData.userId) {
      throw new Error('User ID not found');
    }

    await axios.post(`http://localhost:3001/carts/add-product`, { userId: userData.userId, productId, quantity: 1 }, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      }
    })
      .then(res => {
        console.log('Product added to cart:', res.data);
      })
      .catch(err => {
        console.error('Error adding product to cart:', err);
      });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product); // Set the selected product
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ marginTop: '5px' }}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card style={{ marginTop: '10px', marginBottom: '10px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.images[0]} // Display the first image
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  <Typography variant="body1">Price: {product.price}</Typography>
                  <Typography variant="body1">Average Rating: <TextRating value={product.averageRating} /></Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" style={{ marginTop: '10px' }} onClick={() => addToCart(product._id)}>Add to Cart</Button>
                  <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleViewDetails(product)}>View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Modal for displaying product details */}
      <Dialog
  open={openModal}
  onClose={handleCloseModal}
  maxWidth="md"
  fullWidth
  PaperProps={{
    style: {
      margin: '20px',
      maxHeight: 'none', // Reset maxHeight
      height: '60vh', // Set height to 60% of the viewport height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }}
>
  {selectedProduct && (
    <>
      <DialogTitle>{selectedProduct.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ height: 'auto', flexGrow: 1 }}>
          <Grid item xs={6} style={{ display: 'flex' }}>
            <CardMedia
              component="img"
              height="140"
              width="140"
              image={selectedProduct.images[0]} // Display the first image
              alt={selectedProduct.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Ensure the image fills its container
            />
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <DialogContentText>{selectedProduct.description}</DialogContentText>
              <DialogContentText>Price: {selectedProduct.price}</DialogContentText>
              <DialogContentText>Average Rating: <TextRating value={selectedProduct.averageRating} /></DialogContentText>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Close</Button>
      </DialogActions>
    </>
  )}
</Dialog>

    </>
  );
}

export default Home;
