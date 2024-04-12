import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";
import Favorite from "../models/Favorite";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
const secretKey = " ddsshhrruuvvii";
import { encryptPassword, comparePassword } from "./util";

export const userSignup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const existuser = await User.findOne({ where: { email } });

    if (existuser) {
      return res.status(401).json({ message: "Email is already used" });
    } else {
      const hashedPassword = await encryptPassword(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });
      const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
        expiresIn: "1h",
      });
      res.status(201).json({user, token, userId: user.id,
        role: user.role,
        email: user.email,});
    }
  } catch (error) {
    res.status(500).json({ message: "Error signing up" });
  }
};

export const userSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = { email };
  try {
    const user = await User.findOne({ where: data });

    if (!user) {
      return res
        .status(401)
        .json({ message: "You don't have an account please create one" });
    }
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    res.json({ message: "User login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in user" });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const filterProducts = async (req: Request, res: Response) => {
  try {
    const { category, subcategory } = req.body;
    const products = await Product.findAll({
      where: { category, subcategory },
    });
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error filtering products" });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { searchString } = req.body;

    if (!searchString) {
      return res.status(400).json({ message: "Search string is required" });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchString}%` } },
          { price: { [Op.eq]: `${searchString}` } },
        ],
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the search criteria" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ message: "Error filtering products" });
  }
};

export const favoriteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params; 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingFavorite = await Favorite.findOne({ where: { userId: user.id, productId: product.id } });

    if (existingFavorite) {
      return res.status(400).json({ message: "Product already favorited" });
    }
    await Favorite.create({ userId, productId });
    res.status(200).json({ message: "Product favorited" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error favoriting product" });
  }
};

export const unfavoriteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingFavorite = await Favorite.findOne({ where: { userId: user.id, productId: product.id } });

    if (!existingFavorite) {
      return res.status(400).json({ message: "Product not favorited" });
    }
    await existingFavorite.destroy();

    res.status(200).json({ message: "Product unfavorited" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error unfavoriting product" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getCategoryByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
};

export const getProductByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const sendFeedbackEmail = async (req: Request, res: Response) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME || "dbagadiya34@gmail.com",
        pass: process.env.MAIL_PASSWORD || "mnhtattmwultlwwj",
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME || "dbagadiya34@gmail.com",
      to: process.env.ADMIN_EMAIL || "xegago5979@bizatop.com",
      subject: "Feedback from User",
      text: feedback,
    };

    await transporter.sendMail(mailOptions);
    console.log("Feedback submitted successfully");

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error sending feedback email:", error);
    res.status(500).json({ message: "Error sending feedback email" });
  }
};
