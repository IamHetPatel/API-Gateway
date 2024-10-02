const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Phone', price: 500 }
];

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
