import express from 'express';
import Order from '../models/orderModel.js';

const router = express.Router();

// Order routes
router.get('/order/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/order/:userId', async (req, res) => {
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

router.put('/order/:orderId', async (req, res) => {
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

router.delete('/order/:orderId', async (req, res) => {
  try {
    const removedOrder = await Order.remove({ _id: req.params.orderId });
    res.json(removedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
