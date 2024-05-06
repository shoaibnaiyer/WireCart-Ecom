/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CardMedia,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State for Snackbar severity
  const [userCart, setUserCart] = useState([]); // State to store user's cart items

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then(res => {
        setProducts(res.data)
      })
      .catch(err => console.error(err));

    // Fetch user's cart items if userData is available
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      fetchUserCart(userData.userId);
    }
  }, []);

  const fetchUserCart = (userId) => {
    axios.get(`http://localhost:3001/carts/items/${userId}`)
      .then(res => {
        setUserCart(res.data.cartProducts);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setUserCart([]);
        } else {
          console.error(err);
        }
      });
  };

  const addToCart = async (productId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.userId) {
      setSnackbarSeverity('error'); // Change snackbar severity to error
      setSnackbarMessage('Please login to continue');
      setSnackbarOpen(true);
      return;
    }

    const productInCart = userCart.find(item => item.product._id === productId);
    if (productInCart) {
      setSnackbarMessage('Already in cart');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`http://localhost:3001/carts/add-product`, { userId: userData.userId, productId, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        }
      });

      const updatedCart = await axios.get(`http://localhost:3001/carts/items/${userData.userId}`);
      setUserCart(updatedCart.data.cartProducts);

      setSnackbarSeverity('success'); // Change snackbar severity back to success
      setSnackbarMessage('Added to cart');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                  height="200"
                  image={product.images[0]}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  <Typography variant="body1">Price: {product.price}</Typography>
                  <Typography variant="body1">Average Rating: <TextRating value={product.averageRating} /></Typography>
                </CardContent>
                <CardActions>
                  {userCart.some(item => item.product._id === product._id) ? (
                    <Button variant="outlined" style={{ marginTop: '10px' }} disabled>Already in Cart</Button>
                  ) : (
                    <Button variant="outlined" style={{ marginTop: '10px' }} onClick={() => addToCart(product._id)}>Add to Cart</Button>
                  )}
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
            maxHeight: 'none',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <CardMedia
                    component="img"
                    height="140"
                    width="140"
                    image={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <div>
                    <DialogContentText>{selectedProduct.description}</DialogContentText>
                    <DialogContentText>Price: {selectedProduct.price}</DialogContentText>
                    <DialogContentText>Average Rating: <TextRating value={selectedProduct.averageRating} /></DialogContentText>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
            {/* Reviews Section */}
            <DialogContent>
              <Typography variant="h6">Product Reviews</Typography>
              {selectedProduct.ratings.map(rating => (
                <div key={rating._id}>
                  <Typography variant="subtitle1">{rating.userId}</Typography>
                  <TextRating value={rating.rating} />
                  <Typography variant="body2">{rating.review}</Typography>
                </div>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for showing added to cart message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // Adjust duration as needed
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position Snackbar at the top center
        style={{ marginTop: '50px' }} // Adjust marginTop to position the Snackbar below
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity} // Dynamically set severity based on state
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default Home;
