/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Footer() {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1 }}>
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    © 2024 Shoaib Naiyer
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
