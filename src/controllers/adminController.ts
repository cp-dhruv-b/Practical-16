import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import User from "../models/User";
import Product from "../models/Product";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";
const secretKey = "ddsshhrruuvvii";
import { encryptPassword, comparePassword } from "./util";

interface CustomRequest extends Request {
  admin?: any;
}

export const verifyAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, secretKey);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminSignup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existAdmin = await Admin.findOne({ where: { email } });
    if (existAdmin) {
      return res.status(401).json({ message: "Email is already used" });
    } else {
      const hashedPassword = await encryptPassword(password);
      const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      const token = jwt.sign({ adminId: admin.id, role: admin.role }, secretKey, {
        expiresIn: "1h",
      });

      res.status(201).json({ admin, token, adminId: admin.id,
        role: admin.role,email }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up admin" });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = { email };
  try {
    const admin = await Admin.findOne({ where: data });

    if (!admin) {
      return res.status(401).json({ message: "You are not admin" });
    }
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ adminId: admin.id, role: admin.role }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ message: "Admin login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in admin" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, categoryId, photo } = req.body;
    const product = await Product.create({
      name,
      price,
      categoryId,
      photo
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, photo } = req.body;
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({ name, price, categoryId, photo });
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const category = await Category.create({ name, parentId });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const category = await Category.findByPk(id);
    if (category) {
      await category.update({ name, parentId });
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (category) {
      await category.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

export const getRecentProducts = async (req: Request, res: Response) => {
  try {
    const recentProducts = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    res.status(200).json(recentProducts);
  } catch (error) {
    console.error("Error fetching recent products:", error);
    res.status(500).json({ message: "Error fetching recent products" });
  }
};

export const getSubcategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subcategories = await Category.findAll({ where: { parentId: categoryId } });
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
