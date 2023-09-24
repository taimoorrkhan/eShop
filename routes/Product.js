const express = require('express');
const router = express.Router();

const { getProducts,AddProduct,getSingeProduct,updateProduct,deleteProduct } = require('../controllers/ProductController');


router.route('/products').get(getProducts);

router.route('/product/new').post(AddProduct);

router.route('/product/:id').get(getSingeProduct);

router.route('/admin/product/:id').put(updateProduct);

router.route('/admin/product/:id').delete(deleteProduct);



module.exports = router;