const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Forward to the correct microservice
router.all('/api/users/*', async (req, res) => {
  const targetUrl = `http://user-service:4000${req.originalUrl}`;
  forwardRequest(req, res, targetUrl);
});

router.all('/api/products/*', async (req, res) => {
  const targetUrl = `http://product-service:5001${req.originalUrl}`;
  forwardRequest(req, res, targetUrl);
});

router.all('/api/orders/*', async (req, res) => {
  const targetUrl = `http://order-service:6000${req.originalUrl}`;
  forwardRequest(req, res, targetUrl);
});

async function forwardRequest(req, res, targetUrl) {
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json', ...req.headers },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null
    });
    // console.log(req.body);
    // console.log(req.method);
    // console.log(JSON.stringify(req.body))
    const data = await response.json();
    console.log("Response" , response)
    console.log("Data",data)
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = router;
