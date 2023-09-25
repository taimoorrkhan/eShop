const express = require('express');
const router = express.Router();

const { getProducts, AddProduct,
  getSingeProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
} = require('../controllers/ProductController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);

router.route('/product/:id').get(getSingeProduct);

router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'), AddProduct);

router.route('/admin/product/:id')
  .put(isAuthenticatedUser,authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview);

router.route('/reviews').get(getProductReviews);

router.route('/reviews').delete(isAuthenticatedUser, deleteReview);


module.exports = router;