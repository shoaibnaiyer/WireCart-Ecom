import express from "express";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
