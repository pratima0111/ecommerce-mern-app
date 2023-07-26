import express from 'express';
import {
  registerController,
  loginController,
  forgotPasswordContoller,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

//routing
//REGISTER || POST METHOD
router.post(
  '/register',
  // This route is protected and will only be accessible if the JWT verification is successful
  // Handle the route logic here
  registerController
);

//LOGIN || POST METHOD
router.post('/login', loginController);

//FORGOT PASSWORD || POST METHOD
router.post('/forgot-password', forgotPasswordContoller);

//TEST ROUTE
router.get('/test', requireSignIn, isAdmin, testController);

//PROTECTED ROUTE
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//PROTECTED ADMIN ROUTE
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//UPDATE PROFILE
router.put('/profile', requireSignIn, updateProfileController);

//get user's orders
router.get('/orders', requireSignIn, getOrdersController);

//get all orders: ADMIN
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

//status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;
