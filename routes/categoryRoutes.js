import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  getOneCategoryController,
  updateCategoryController,
} from '../controllers/categoryController.js';

const router = express.Router();

//routes
//create category
router.post(
  '/create-category',
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  '/update-category/:id',
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all categories
router.get('/categories', getCategoryController);

//get one category
router.get('/single-category/:slug', getOneCategoryController);

//delete category
router.delete(
  '/delete-category/:id',
  requireSignIn,
  isAdmin,
  deleteCategoryController
);



export default router;
