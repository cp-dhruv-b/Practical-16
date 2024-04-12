import express, { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  adminSignup,
  adminSignin,
  createProduct,
  verifyAdmin,
  deleteProduct,
  updateProduct,
  getUsers,
  getRecentProducts,
  deleteUser,
  getSubcategory,
} from "../controllers/adminController";
import {
  getProducts,
  getProductByID,
  filterProducts,
  favoriteProduct,
  unfavoriteProduct,
  getCategories,
  getCategoryByID,
  search,
} from "../controllers/userController";

const router: Router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminSignin);
router.post("/product", verifyAdmin, createProduct);
router.put("/product/:id", verifyAdmin, updateProduct);
router.delete("/product/:id", verifyAdmin, deleteProduct);
router.post("/category", verifyAdmin, createCategory);
router.put("/category/:id", verifyAdmin, updateCategory);
router.delete("/category/:id", verifyAdmin, deleteCategory);
router.get("/product", verifyAdmin, getProducts);
router.get("/product/:id", verifyAdmin, getProductByID);
router.get("/product/filter", filterProducts);
router.post("/product/:productId/favorite",favoriteProduct);
router.delete("/product/:productId/favorite", unfavoriteProduct);
router.get("/category", verifyAdmin, getCategories);
router.get("/category/:id", verifyAdmin, getCategoryByID);
router.get("/search", search);
router.get("/users",verifyAdmin, getUsers);
router.delete("/users/:id",verifyAdmin, deleteUser);
router.get("/recent/product",verifyAdmin, getRecentProducts);
router.get("/category/:id/subcategories", getSubcategory)

export default router;
