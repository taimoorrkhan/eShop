const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1)
})

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database

connectDB();




const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Loaded NODE_ENV:", process.env.NODE_ENV);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejection`);
  server.close(() => {
    process.exit(1)
  })
}) 