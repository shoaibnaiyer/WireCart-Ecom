import Product from "../models/productModel.js";

// Add a new product
export const addProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    quantity: req.body.quantity,
    images: req.body.images,
    ratings: req.body.ratings,
  });

  try {
    // If ratings are provided, calculate the average rating
    if (req.body.ratings && req.body.ratings.length > 0) {
      const totalRatings = req.body.ratings.reduce(
        (total, rating) => total + rating.rating,
        0
      );
      product.averageRating = Number(
        (totalRatings / req.body.ratings.length).toFixed(2)
      );
    }

    const newProduct = await product.save();
    res.status(201).json({ newProduct, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ message: error.message });
  }
};

// POST to update a specific product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }

    // Update fields in the product
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.quantity = req.body.quantity || product.quantity;
    product.images = req.body.images || product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Post a new rating for a product
export const addRating = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }

    const newRating = {
      userId: req.body.userId,
      rating: req.body.rating,
      review: req.body.review,
    };

    product.ratings.push(newRating);

    // Recalculate the average rating
    const totalRatings = product.ratings.reduce(
      (total, rating) => total + rating.rating,
      0
    );
    product.averageRating = totalRatings / product.ratings.length;

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Error getting products" });
  }
};

// Get a specific product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.json(product.ratings); // ratings field contains the reviews
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ deletedProduct, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};