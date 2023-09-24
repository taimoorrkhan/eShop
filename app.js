const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());


// Import routes
const Products = require('./routes/Product');
const Auth = require('./routes/Auth');

app.use('/api/v1', Products);
app.use('/api/v1', Auth);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;