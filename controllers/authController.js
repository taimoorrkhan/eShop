const User = require('../models/user');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
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
}
);

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

// Logout user => /api/v1/logout
const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: 'Logged out'
  })

})
// Forgot Password => /api/v1/password/forgot

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User Not Found with this Email', 401));
  }
  // Get Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'eShop Password Recovery',
      message
    })
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`
    })
    } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500))

}

})

// Reset Password => /api/v1/password/reset/:token

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({ 
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if(!user) {
    return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
  }
  if(req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }
  // Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  })
})

// get Currently Logged in user details => /api/v1/me

const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: user
  })
}) 

// update / change password => /api/v1/password/update

const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if(!user) {
    return next(new ErrorHandler('User Not Found', 401));
  }
  // Check previous user password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched) {
    return next(new ErrorHandler('Invalid  Password', 401));
  }

  user.password = req.body.password;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
 
})

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword
}