const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
// Import routes

const Products = require('./routes/Product');

app.use('/api/v1', Products);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;