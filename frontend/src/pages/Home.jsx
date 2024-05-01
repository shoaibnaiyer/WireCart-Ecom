/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardActions, Button, Typography, CardMedia, Container } from '@mui/material';

function Home() {
  const [products, setProducts] = useState([]);

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
                  <Typography variant="body1">Average Rating: {product.averageRating}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" style={{ marginTop: '10px' }} onClick={() => addToCart(product._id)}>Add to Cart</Button>
                  <Button variant="contained" style={{ marginTop: '10px' }}>View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Home;
