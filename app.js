const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

app.use(cookieParser());


// Import routes
const Products = require('./routes/Product');
const Auth = require('./routes/Auth');
const Order = require('./routes/Order');

app.use('/api/v1', Products);
app.use('/api/v1', Auth);
app.use('/api/v1', Order);


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;