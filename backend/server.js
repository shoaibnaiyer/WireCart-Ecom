import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";

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
    const userId = req.params.id;
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
    const token = jwt.sign({ userId: user._id, userType: user.role }, secretKey, {
      expiresIn: "1hr",
    });
    res.json({ message: "Login Successful", token, userType: user.role, userId : user._id });
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
      const totalRatings = req.body.ratings.reduce((total, rating) => total + rating.rating, 0);
      product.averageRating = Number((totalRatings / req.body.ratings.length).toFixed(2));
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
    res.status(200).json({ deletedProduct, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});



// Different way to post products
// // Add New Product
// // app.post("/products", async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       description,
// //       price,
// //       images,
// //       quantity,
// //       category,
// //       brand,
// //       ratings,
// //       reviews,
// //     } = req.body;
// //     const newProduct = new Product({
// //       name,
// //       description,
// //       price,
// //       images,
// //       quantity,
// //       category,
// //       brand,
// //       ratings,
// //       reviews,
// //     });
// //     await newProduct.save();
// //     res.status(201).json({ newProduct, message: "Product added successfully" });
// //   } catch (error) {
// //     console.error("Error adding product:", error);
// //     res.status(500).json({ error: "Error adding product" });
// //   }
// // });

// // Below is another simple register and login req and res
// // app.post('/register', (req, res) => {
// //     User.create(req.body)
// //     .then(User = res.json(User))
// //     .catch(err => res.json(err))
// // })

// // app.post('/login', (req, res) => {
// // const{email, password, role} = req.body;
// // User.findOne({email: email})
// // .then(user => {
// //     if(user.role === role) {
// //         if(user.password === password) {
// //             res.json("Login Successful")
// //         } else {
// //             res.json("Incorrect Password")
// //         }
// //     } else {
// //         res.json("No record found")
// //     }
// // })
// // })
