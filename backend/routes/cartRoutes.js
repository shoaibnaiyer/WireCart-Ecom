import express from 'express';
import Cart from '../models/cartModel.js';

const router = express.Router();

// Cart routes
router.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cart/:userId', async (req, res) => {
  const newCartItem = new Cart({
    user: req.params.userId,
    products: req.body.products,
  });

  try {
    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/cart/:userId/:productId', async (req, res) => {
  try {
    const updatedCart = await Cart.updateOne(
      { user: req.params.userId, 'products.product': req.params.productId },
      { $set: { 'products.$.quantity': req.body.quantity } }
    );
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/cart/:userId/:productId', async (req, res) => {
  try {
    const removedProduct = await Cart.updateOne(
      { user: req.params.userId },
      { $pull: { products: { product: req.params.productId } } }
    );
    res.json(removedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
