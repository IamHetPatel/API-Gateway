const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.all('/api/*', async (req, res) => {
  try {
    const targetUrl = `http://localhost:3000${req.originalUrl}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
