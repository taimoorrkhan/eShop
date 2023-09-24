const express = require('express');
const router = express.Router();

const { getProducts,AddProduct,getSingeProduct,updateProduct,deleteProduct } = require('../controllers/ProductController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);

router.route('/product/new').post(isAuthenticatedUser, AddProduct);

router.route('/product/:id').get(getSingeProduct);

router.route('/admin/product/:id')
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);




module.exports = router;