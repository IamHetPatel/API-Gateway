const express = require('express');
const app = express();
app.use(express.json());

let orders = [
  { id: 1, product: 'Laptop', quantity: 2 },
  { id: 2, product: 'Phone', quantity: 1 }
];

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get a specific order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).send('Order not found');
  res.json(order);
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
