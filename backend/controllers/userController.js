import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import {generateToken} from "../middlewares/authMiddleware.js"

const secretKey = process.env.SECRET_KEY;

// Registering Users
export const registerUser = async (req, res) => {
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
};

// Get Registered Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
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
};

// Update user by ID
export const updateUser = async (req, res) => {
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
};

// Delete User by ID
export const deleteUser = async (req, res) => {
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
};

// Get Login
export const loginUser = async (req, res) => {
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
      const token = generateToken(user._id, user.role); // Use the generateToken function
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
  };