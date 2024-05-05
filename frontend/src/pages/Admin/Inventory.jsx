/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Modal,
  TextField,
  useStepContext
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    quantity: 0,
    price: 0,
    ratings: []
  });
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const columns = [
    { id: 'serial', name: 'S. No.' },
    { id: 'name', name: 'Name' },
    { id: 'description', name: 'Description' },
    { id: 'brand', name: 'Brand' },
    { id: 'category', name: 'Category' },
    { id: 'quantity', name: 'Quantity' },
    { id: 'ratings', name: 'Rating' },
    { id: 'price', name: 'Price' },
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
    axios.get('http://localhost:3001/products')
      .then((res) => {
        setProducts(res.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleDeleteConfirmation = () => {
    axios.delete(`http://localhost:3001/products/${selectedProduct._id}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== selectedProduct._id));
        setConfirmationModalOpen(false); // Close the confirmation modal after deletion
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  const handleDelete = (productId) => {
    setSelectedProduct(products.find(product => product._id === productId));
    setConfirmationModalOpen(true);
  };

  const handleImageChange = (event) => {
    setNewProduct({ ...newProduct, images: event.target.files });
  };


  const handleAddProduct = () => {

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('brand', newProduct.brand);
    formData.append('quantity', newProduct.quantity);
    formData.append('ratings', newProduct.ratings ? JSON.stringify(newProduct.ratings) : ''); // Ratings might be optional

    // Append each image file to the formData
    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append('images', newProduct.images[i]);
    }

    // Log the FormData object
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]); // Log each key-value pair in the FormData object
    }

    axios.post('http://localhost:3001/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data for file upload
      }
    })
      .then(response => {
        setProducts([...products, response.data.newProduct]);
        handleCloseModal();
        console.log(response);
        console.log('Product added successfully:', response.data.newProduct); // Log success message
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('brand', newProduct.brand);
    formData.append('quantity', newProduct.quantity);
    formData.append('ratings', newProduct.ratings ? JSON.stringify(newProduct.ratings) : ''); // Ratings might be optional

    // Append each image file to the formData
    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append('images', newProduct.images[i]);
    }

    axios.put(`http://localhost:3001/products/${selectedProduct._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data for file upload
      }
    })
      .then(response => {
        // Update the product list with the updated product
        const updatedProducts = products.map(product => {
          if (product._id === selectedProduct._id) {
            return response.data.updatedProduct;
          }
          return product;
        });
        setProducts(updatedProducts);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  };

  // const handleAddProduct = () => {
  //   axios.post('http://localhost:3001/products', newProduct)
  //     .then(response => {
  //       setProducts([...products, response.data.newProduct]);
  //       handleCloseModal();
  //     })
  //     .catch(error => {
  //       console.error('Error adding product:', error);
  //     });
  // };

  // const handleUpdate = () => {
  //   axios.post(`http://localhost:3001/products/${selectedProduct._id}`, newProduct)
  //     .then(() => {
  //       // Update the product list with the updated product
  //       setProducts(products.map(product => (product._id === selectedProduct._id ? newProduct : product)));
  //       handleCloseModal();
  //     })
  //     .catch(error => {
  //       console.error('Error updating product:', error);
  //     });
  // };

  const handleOpenModal = (mode, product) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setNewProduct({ ...product }); // Populate the form fields with current product details
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
    setNewProduct({
      name: '',
      description: '',
      brand: '',
      category: '',
      quantity: 0,
      price: 0,
      ratings: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h2" gutterBottom style={{ marginTop: '20px' }}>Product List</Typography>
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleOpenModal('add', null)}>Add New Product</Button>
        </Box>
        <Paper>
          {/* <Paper sx={{width:'90%', marginLeft:'5%'}}> */}
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>

                  {columns.map((column) => (
                    <TableCell style={{ backgroundColor: 'black', color: 'white' }} key={column.id}><b>{column.name}</b></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell>{index + 1 + page * rowperpage}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.averageRating}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton aria-label="edit" onClick={() => handleOpenModal('edit', product)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete" onClick={() => handleDelete(product._id)}>
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
            count={products.length}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          />
        </Paper>
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
              {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
            </Typography>
            <TextField
              label="Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Brand"
              name="brand"
              value={newProduct.brand}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={newProduct.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            /><input
              accept="image/*"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <Button variant="contained" onClick={modalMode === 'add' ? handleAddProduct : handleUpdate}>
              {modalMode === 'add' ? 'Add Product' : 'Update Product'}
            </Button>
          </Box>
        </Modal>
        <Modal
          open={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          aria-labelledby="confirmation-modal-title"
          aria-describedby="confirmation-modal-description"
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
              Delete Product
            </Typography>
            <Typography id="confirmation-modal-title" sx={{ mt: 2 }}>
              Are you sure you want to delete the product?
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color='error' onClick={handleDeleteConfirmation} sx={{ marginRight: 2 }}>Yes</Button>
              <Button variant="contained" onClick={() => setConfirmationModalOpen(false)}>No</Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  )
}

export default Inventory;
