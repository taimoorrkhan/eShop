const express = require('express');

const router = express.Router();

const { registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getUserDetails,
  updateAdminUserProfile,
  deleteUser
}
  = require('../controllers/authController');

  const  {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth');

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/profile').get(isAuthenticatedUser, getUserProfile);

router.route('/profile/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/profile/update').put(isAuthenticatedUser, updateUserProfile);

// Admin routes

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateAdminUserProfile)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
  


module.exports = router;


