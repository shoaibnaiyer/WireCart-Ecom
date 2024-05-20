/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CardActionArea, Icon } from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const DashboardCustomer = () => {

  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserName() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.userId) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(`http://localhost:3001/user/${userData.userId}`);
        setUserName(response.data.name);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false)
      }
    }

    fetchUserName();
  }, []);

  const cards = [
    {
      id: 1,
      title: "Profile",
      description: "Click this card to view and manage your profile",
      link: "/profile",
      icon: ShoppingBagIcon
    },
    {
      id: 2,
      title: "Orders",
      description: "Click this card to view and manage Orders",
      link: "/orders",
      icon: LocalShippingIcon
    },

    {
      id: 3,
      title: "Favorites",
      description: "Click this card to view and manage Favorites",
      link: "/favorites",
      icon: PeopleIcon
    },

    {
      id: 4,
      title: "Cart",
      description: "Click this card to view and manage Cart",
      link: "/cart",
      icon: PeopleIcon
    },
  ];

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom style={{ marginTop: '20px' }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>Welcome, {userName}!</p>
          )}
        </Typography>
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Customer Dashboard</Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
              <Link to={card.link} style={{ textDecoration: 'none' }}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardContent style={{ textAlign: 'center' }}>
                      <Icon
                        component={card.icon}
                        sx={{ fontSize: 80, marginBottom: 10 }}
                      />
                      <Typography gutterBottom variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
};

export default DashboardCustomer;
