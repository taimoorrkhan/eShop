const { connect } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const connectDB = async () => {
  await connect(process.env.DB_LOCAL_URI, {
 
  })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err.message));
}
module.exports = connectDB;