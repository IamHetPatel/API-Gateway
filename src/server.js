const express = require('express');
const cache = require('./cache');
const rateLimiter = require('./rateLimiter');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use('/api/*', rateLimiter);
app.use('/api/*', cache);
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
