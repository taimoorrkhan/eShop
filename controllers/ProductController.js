const Product = require('../models/product')

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");


//Creating Product

const AddProduct = async (req, res, next) => {


  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  })


}

//Get All Products
const getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    products
  })
})


const getSingeProduct = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }
  res.status(200).json({
    success: true,
    product
  })
})

const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
    product
  })
})

/* Delete Product */

const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted"
  })
}
)

module.exports = {
  AddProduct,
  getProducts,
  getSingeProduct,
  updateProduct,
  deleteProduct
}