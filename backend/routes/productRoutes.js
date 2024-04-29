import express from "express";
import {
  addProduct,
  updateProduct,
  addRating,
  getAllProducts,
  getProductById,
  getProductReviews,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);
router.post("/:id", updateProduct);
router.post("/:id/ratings", addRating);
router.get("/", getAllProducts);
router.get("/product/:id", getProductById);
router.get("/:id/reviews", getProductReviews);
router.delete("/:id", deleteProduct);

export default router;