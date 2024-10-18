const express = require('express');
const rateLimiter = require('./rateLimiter');
const cache = require('./cache');
const auth = require('./auth');
const logging = require('./logging');
const routes = require('./routes');
const setupSwagger = require('./swagger'); // Import Swagger setup


const app = express();
app.use(express.json());
// Logging middleware
app.use(logging);

// Rate Limiting middleware
app.use('/api/*', rateLimiter);

// // // Authentication middleware
// // app.use('/api/*', auth);

// Caching middleware
app.use('/api/*', cache);

// Forwarding requests to microservices
app.use('/', routes);

setupSwagger(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
