import React from 'react';
import { Box, Button, Typography, Select, MenuItem } from '@mui/material';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event) => {
    const itemsPerPage = parseInt(event.target.value);
    onItemsPerPageChange(itemsPerPage);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
      <Typography variant="body2">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </Typography>
      <Box display="flex" alignItems="center">
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <MenuItem value={5}>5 per page</MenuItem>
          <MenuItem value={10}>10 per page</MenuItem>
          <MenuItem value={15}>15 per page</MenuItem>
        </Select>
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Pagination;
