import express, { Router } from "express";
import {
  getProducts,
  filterProducts,
  favoriteProduct,
  unfavoriteProduct,
  userSignup,
  userSignin,
  getCategories,
  getCategoryByID,
  getProductByID,
  search,
  sendFeedbackEmail,
} from "../controllers/userController";

const router: Router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userSignin);
router.get("/product", getProducts);
router.get("/product/:id", getProductByID);
router.get("/productfilter", filterProducts);
router.post("/product/:productId/favorite", favoriteProduct);
router.delete("/product/:productId/favorite", unfavoriteProduct);
router.get("/category", getCategories);
router.get("/category/:id", getCategoryByID);
router.get("/search", search);
router.post("/feedback", sendFeedbackEmail);

export default router;
