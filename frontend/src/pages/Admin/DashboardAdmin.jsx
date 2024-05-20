/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';

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

const DashboardAdmin = () => {

  const cards = [
    {
      id: 1,
      title: "Inventory",
      description: "Click this card to view and manage Inventory",
      link: "/inventory",
      icon: ShoppingBagIcon
    },
    {
      id: 2,
      title: "Orders",
      description: "Click this card to view and manage Orders",
      link: "/order-list",
      icon: LocalShippingIcon
    },

    {
      id: 3,
      title: "Customers",
      description: "Click this card to view and manage Customers",
      link: "/customer-list",
      icon: PeopleIcon
    },
  ];

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Admin Dashboard</Typography>
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

export default DashboardAdmin;
