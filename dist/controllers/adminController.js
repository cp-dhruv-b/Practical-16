"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubcategory = exports.getRecentProducts = exports.deleteUser = exports.getUsers = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.adminSignin = exports.adminSignup = exports.verifyAdmin = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const Admin_1 = __importDefault(require("../models/Admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = "ddsshhrruuvvii";
const util_1 = require("./util");
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.admin = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
exports.verifyAdmin = verifyAdmin;
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existAdmin = yield Admin_1.default.findOne({ where: { email } });
        if (existAdmin) {
            return res.status(401).json({ message: "Email is already used" });
        }
        else {
            const hashedPassword = yield (0, util_1.encryptPassword)(password);
            const admin = yield Admin_1.default.create({
                name,
                email,
                password: hashedPassword,
                role: "admin",
            });
            const token = jsonwebtoken_1.default.sign({ adminId: admin.id, role: admin.role }, secretKey, {
                expiresIn: "1h",
            });
            res.status(201).json({ admin, token, adminId: admin.id,
                role: admin.role, email });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up admin" });
    }
});
exports.adminSignup = adminSignup;
const adminSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const data = { email };
    try {
        const admin = yield Admin_1.default.findOne({ where: data });
        if (!admin) {
            return res.status(401).json({ message: "You are not admin" });
        }
        const isMatch = yield (0, util_1.comparePassword)(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id, role: admin.role }, secretKey, {
            expiresIn: "1h",
        });
        res.json({ message: "Admin login successful", token });
    }
    catch (error) {
        res.status(500).json({ message: "Error signing in admin" });
    }
});
exports.adminSignin = adminSignin;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, categoryId, photo } = req.body;
        const product = yield Product_1.default.create({
            name,
            price,
            categoryId,
            photo
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, categoryId, photo } = req.body;
        const product = yield Product_1.default.findByPk(id);
        if (product) {
            yield product.update({ name, price, categoryId, photo });
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.default.findByPk(id);
        if (product) {
            yield product.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, parentId } = req.body;
        const category = yield Category_1.default.create({ name, parentId });
        res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating category" });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, parentId } = req.body;
        const category = yield Category_1.default.findByPk(id);
        if (category) {
            yield category.update({ name, parentId });
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findByPk(id);
        if (category) {
            yield category.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
});
exports.deleteCategory = deleteCategory;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findByPk(id);
        if (user) {
            yield user.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
});
exports.deleteUser = deleteUser;
const getRecentProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentProducts = yield Product_1.default.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
        res.status(200).json(recentProducts);
    }
    catch (error) {
        console.error("Error fetching recent products:", error);
        res.status(500).json({ message: "Error fetching recent products" });
    }
});
exports.getRecentProducts = getRecentProducts;
const getSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const category = yield Category_1.default.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const subcategories = yield Category_1.default.findAll({ where: { parentId: categoryId } });
        res.json(subcategories);
    }
    catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getSubcategory = getSubcategory;
