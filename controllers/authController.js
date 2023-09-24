const User = require('../models/user');

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');


//Register a user => /api/v1/register

const registerUser = catchAsyncErrors(async (req, res, next) => {
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'avatars/kkqjz1v9j0hjv3jwz5xj',
        url: 'https://res.cloudinary.com/bookit/image/upload/v1606307075/avatars/kkqjz1v9j0hjv3jwz5xj.jpg'
      }
    })
  sendToken(user, 200, res);
})

// Login User => /api/v1/login

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if(!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400))
  }
  // Finding user in database
  const user = await User.findOne({ email }).select('+password');
  if(!user) {
    return next(new ErrorHandler('User Not Found with Entered Email', 401));
  }
  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if(!isPasswordMatched) {
    return next(new ErrorHandler('Invalid  Password', 401));
  }
  sendToken(user, 200, res);
})


module.exports = {
  registerUser,
  loginUser
}