const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://mongodb-product:27017/products', {
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const Product = mongoose.model('Product', productSchema);

// Create a product
app.post('/api/products', [
  body('name').not().isEmpty(),
  body('price').isNumeric(),
  body('stock').isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, price, stock } = req.body;

  try {
    const product = new Product({ name, price, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update product stock
app.put('/api/products/:id/stock', [
  body('stock').isNumeric(),
], async (req, res) => {
  const { stock } = req.body;
  
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating stock' });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
