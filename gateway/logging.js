const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Setup logging with morgan
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const logging = morgan('combined', { stream: accessLogStream });

module.exports = logging;
