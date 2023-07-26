import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
  brainTreePaymentController,
  braintreeTokenController,
  // brainTreePaymentController,
  // braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get('/get-product', getProductController);

//get one product
router.get('/single-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//filter products
router.post('/filter-product', productFilterController);

//product count
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search a product
router.get('/search/:keyword', searchProductController);

//similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController);

//payments routes
//for token
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

export default router;
