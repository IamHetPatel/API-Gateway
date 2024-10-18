const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://mongodb-order:27017/orders', {
});

const orderSchema = new mongoose.Schema({
  userId: String,
  products: [{ productId: String, quantity: Number }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);

// Create an order
app.post('/api/orders', async (req, res) => {
  const { userId, products } = req.body;
  let totalAmount = 0;

  for (const product of products) {
    const productData = await fetch(`http://product-service:5001/api/products/${product.productId}`);
    const productInfo = await productData.json();
    totalAmount += productInfo.price * product.quantity;
  }

  try {
    const order = new Order({ userId, products, totalAmount });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Get orders by user
app.get('/api/orders/user/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
