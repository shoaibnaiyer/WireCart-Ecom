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
  Snackbar,
  TextField,
  IconButton
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';

const labels = {
  '0.5-1': 'Useless',
  '1-1.5': 'Useless+',
  '1.5-2': 'Poor',
  '2-2.5': 'Poor+',
  '2.5-3': 'Ok',
  '3-3.5': 'Ok+',
  '3.5-4': 'Good',
  '4-4.5': 'Good+',
  '4.5-5': 'Excellent',
  '5': 'Excellent+',
};

function TextRating({ value }) {
  const label = Object.entries(labels).find(([range]) => {
    const [min, max] = range.split('-').map(parseFloat);
    return value >= min && (max === undefined || value < max);
  });

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
        {value} ({label ? label[1] : 'Unknown'})
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [userCart, setUserCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error(err));

    // Fetch user's cart items and favorites if userData is available
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.userId) {
      fetchUserCart(userData.userId);
      fetchUserFavorites(userData.userId);
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

  const fetchUserFavorites = (userId) => {
    axios.get(`http://localhost:3001/favorites/items/${userId}`)
      .then(res => {
        setFavorites(res.data.favoriteProducts);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleSubmitReview = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.userId) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please login to add a review');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`http://localhost:3001/products/${selectedProduct._id}/ratings`, {
        userId: userData.userId,
        rating: newRating,
        review: newReview
      });

      setSnackbarSeverity('success');
      setSnackbarMessage('Review added successfully');
      setSnackbarOpen(true);

      // Refresh product data after adding the review
      const updatedProducts = await axios.get('http://localhost:3001/products');
      setProducts(updatedProducts.data);
    } catch (error) {
      console.error('Error adding review:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add review. Please try again later.');
      setSnackbarOpen(true);
    }
  };

  const addToCart = async (productId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.userId) {
      setSnackbarSeverity('error');
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

      setSnackbarSeverity('success');
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

  const handleAddToFavorites = async (productId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.userId) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please login to add to favorites');
      setSnackbarOpen(true);
      return;
    }

    try {
      const productInFavoritesIndex = favorites.findIndex(product => product._id === productId);
      if (productInFavoritesIndex !== -1) {
        // Product is already in favorites, remove it
        await axios.delete(`http://localhost:3001/favorites/remove-product/${userData.userId}/${productId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        const updatedFavorites = favorites.filter(product => product._id !== productId);
        setFavorites(updatedFavorites);

        setSnackbarSeverity('success');
        setSnackbarMessage('Removed from favorites');
      } else {
        // Product is not in favorites, add it
        await axios.post(`http://localhost:3001/favorites/add-product`, { userId: userData.userId, productId }, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        const updatedFavorites = [...favorites, { _id: productId }];
        setFavorites(updatedFavorites);

        setSnackbarSeverity('success');
        setSnackbarMessage('Added to favorites');
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding product to favorites:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add to favorites. Please try again later.');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ marginTop: '5px' }}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card style={{ marginTop: '10px', marginBottom: '10px', position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0]}
                  alt={product.name}
                />
                <IconButton
                  onClick={() => handleAddToFavorites(product._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: favorites.some(fav => fav._id === product._id) ? 'red' : 'white',
                  }}
                >
                  {favorites.some(fav => fav._id === product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
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
                    <Button variant="outlined" style={{ marginTop: '10px' }} onClick={() => addToCart(product._id)}>Add to Cart<AddShoppingCartIcon /></Button>
                  )}
                  <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleViewDetails(product)}>View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
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
              <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                <Grid item xs={6}>
                  <Typography variant="h6">Product Reviews</Typography>
                  {selectedProduct.ratings.map(rating => (
                    <div key={rating._id}>
                      <Typography variant="subtitle1">{rating.userId.name}</Typography>
                      <TextRating value={rating.rating} />
                      <Typography variant="body2">{rating.review}</Typography>
                    </div>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Add a Review</Typography>
                  <Rating
                    name="new-rating"
                    value={newRating}
                    onChange={(event, newValue) => setNewRating(newValue)}
                    precision={0.5}
                    style={{ marginTop: '10px' }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    label="Your Review"
                    value={newReview}
                    onChange={(event) => setNewReview(event.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={handleSubmitReview}>
                    Submit Review
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>X</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ marginTop: '50px' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default Home;
