//Code for MVC

// import app from "./app.js";
// import mongoose from "./config/db.js";
// import dotenv from "dotenv";

// dotenv.config({ path: "../.env" });

// const port = process.env.PORT || 3001;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Cart from "./models/cartModel.js";
import Order from "./models/orderModel.js";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// dotenv.config();
dotenv.config({ path: "../.env" });

const dbURI = process.env.DB_URI;
const port = process.env.PORT || 3001;
const secretKey = process.env.SECRET_KEY;

mongoose
  .connect(dbURI, {})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port} and connected to MongoDB`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect to the Server");
  });

// Registering Users
app.post("/register", async (req, res) => {
  try {
    const { name, email, address, mobile, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      address,
      mobile,
      role,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error Registering User" });
  }
});

// Get Registered Users
app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
});

// Get User by ID
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Error fetching user by ID" });
  }
});

// Update user by ID
app.put("/user/:id", async (req, res) => {
  try {
    // const userId = req.params.id;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields in the user
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.mobile = req.body.mobile || user.mobile;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Update user details using post, including password
// app.post("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update fields in the user
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.address = req.body.address || user.address;
//     user.mobile = req.body.mobile || user.mobile;
//     user.role = req.body.role || user.role;

//     // Update password if provided
//     if (req.body.password) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       user.password = hashedPassword;
//     }

//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update user details, including password
// Update user details, including password
// app.put("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify current password
//     const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid current password" });
//     }

//     // Update fields in the user
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.address = req.body.address || user.address;
//     user.mobile = req.body.mobile || user.mobile;
//     user.role = req.body.role || user.role;

//     // Update password if provided and current password is valid
//     if (req.body.password) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       user.password = hashedPassword;
//     }

//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Delete User by ID
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ error: "Error deleting user by ID" });
  }
});

// Get Login
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email does not exist" });
    }
    if (user.role !== role) {
      return res.status(401).json({ error: "Invalid role" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const token = jwt.sign(
      { userId: user._id, userType: user.role },
      secretKey,
      {
        expiresIn: "1hr",
      }
    );
    res.json({
      message: "Login Successful",
      token,
      userType: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Add a new product
app.post("/products", async (req, res) => {
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
});

// POST to update a specific product
app.post("/products/:id", async (req, res) => {
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
});

// Post a new rating for a product
app.post("/products/:id/ratings", async (req, res) => {
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
});

// Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Error getting products" });
  }
});

// Get a specific product
app.get("/products/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET reviews for a specific product
app.get("/products/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.json(product.ratings); // ratings field contains the reviews
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// // Deleting a Product
// app.delete('/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Cannot find product' });
//     }

//     await product.remove();
//     res.json({ message: 'Product deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Delete a product
app.delete("/products/:id", async (req, res) => {
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
});

//Add items to cart
app.post("/carts/add-product", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one with the product
      cart = new Cart({ user: userId, products: [{ product: productId, quantity: 1 }] });
      await cart.save();
    } else {
      // Check if the product already exists in the cart
      const existingProduct = cart.products.find(product => product.product.equals(productId));

      if (existingProduct) {
        // If the product already exists in the cart, increment its quantity
        existingProduct.quantity += 1;
      } else {
        // If the product doesn't exist in the cart, add it with quantity 1
        cart.products.push({ product: productId, quantity: 1 });
      }
      await cart.save();
    }

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get items of cart
app.get("/carts/items/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cartProducts: cart.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increase or decrease the quantity of an item in the cart
app.put("/carts/update-quantity/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(product => product.product.equals(productId));

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    if (quantity === 0) {
      // If the quantity is set to zero, remove the item from the cart
      cart.products.splice(productIndex, 1);
    } else {
      // Otherwise, update the quantity of the item
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a product from the cart
app.delete("/carts/remove-product/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(product => product.product.equals(productId));

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Change the quantity of an existing item in the logged-in user's cart
app.put("/carts/change-quantity", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex((item) =>
      item.product.equals(productId)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Update the quantity of the product
    cart.products[productIndex].quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item from the logged-in user's cart
app.delete("/carts/delete-item", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => !item.product.equals(productId)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all items from the logged-in user's cart
app.delete("/carts/delete-all-items", async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Clear all products from the cart
    cart.products = [];

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update quantity of a product in the cart
app.put("/carts/update-item/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Product quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a product from the cart
app.delete("/carts/delete-item/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Order routes
app.get("/order/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/order/:userId", async (req, res) => {
  const newOrder = new Order({
    user: req.params.userId,
    products: req.body.products,
    totalAmount: req.body.totalAmount,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/order/:orderId", async (req, res) => {
  try {
    const updatedOrder = await Order.updateOne(
      { _id: req.params.orderId },
      { $set: { status: req.body.status } }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/order/:orderId", async (req, res) => {
  try {
    const removedOrder = await Order.remove({ _id: req.params.orderId });
    res.json(removedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

