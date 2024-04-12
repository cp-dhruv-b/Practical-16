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
exports.sendFeedbackEmail = exports.getProductByID = exports.getCategoryByID = exports.getCategories = exports.unfavoriteProduct = exports.favoriteProduct = exports.search = exports.filterProducts = exports.getProducts = exports.userSignin = exports.userSignup = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
const Favorite_1 = __importDefault(require("../models/Favorite"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = " ddsshhrruuvvii";
const util_1 = require("./util");
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const existuser = yield User_1.default.findOne({ where: { email } });
        if (existuser) {
            return res.status(401).json({ message: "Email is already used" });
        }
        else {
            const hashedPassword = yield (0, util_1.encryptPassword)(password);
            const user = yield User_1.default.create({
                username,
                email,
                password: hashedPassword,
                role: "user",
            });
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secretKey, {
                expiresIn: "1h",
            });
            res.status(201).json({ user, token, userId: user.id,
                role: user.role,
                email: user.email, });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
});
exports.userSignup = userSignup;
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const data = { email };
    try {
        const user = yield User_1.default.findOne({ where: data });
        if (!user) {
            return res
                .status(401)
                .json({ message: "You don't have an account please create one" });
        }
        const isMatch = yield (0, util_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
        res.json({ message: "User login successful", token });
    }
    catch (error) {
        res.status(500).json({ message: "Error signing in user" });
    }
});
exports.userSignin = userSignin;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.findAll();
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
});
exports.getProducts = getProducts;
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, subcategory } = req.body;
        const products = yield Product_1.default.findAll({
            where: { category, subcategory },
        });
        if (products) {
            res.status(200).json(products);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error filtering products" });
    }
});
exports.filterProducts = filterProducts;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchString } = req.body;
        if (!searchString) {
            return res.status(400).json({ message: "Search string is required" });
        }
        const products = yield Product_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${searchString}%` } },
                    { price: { [sequelize_1.Op.eq]: `${searchString}` } },
                ],
            },
        });
        if (products.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found matching the search criteria" });
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error filtering products:", error);
        res.status(500).json({ message: "Error filtering products" });
    }
});
exports.search = search;
const favoriteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { productId } = req.params;
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = yield Product_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const existingFavorite = yield Favorite_1.default.findOne({ where: { userId: user.id, productId: product.id } });
        if (existingFavorite) {
            return res.status(400).json({ message: "Product already favorited" });
        }
        yield Favorite_1.default.create({ userId, productId });
        res.status(200).json({ message: "Product favorited" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error favoriting product" });
    }
});
exports.favoriteProduct = favoriteProduct;
const unfavoriteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { productId } = req.params;
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = yield Product_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const existingFavorite = yield Favorite_1.default.findOne({ where: { userId: user.id, productId: product.id } });
        if (!existingFavorite) {
            return res.status(400).json({ message: "Product not favorited" });
        }
        yield existingFavorite.destroy();
        res.status(200).json({ message: "Product unfavorited" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error unfavoriting product" });
    }
});
exports.unfavoriteProduct = unfavoriteProduct;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.findAll();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
});
exports.getCategories = getCategories;
const getCategoryByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Category_1.default.findByPk(id);
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching category" });
    }
});
exports.getCategoryByID = getCategoryByID;
const getProductByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield Product_1.default.findByPk(id);
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
});
exports.getProductByID = getProductByID;
const sendFeedbackEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedback } = req.body;
        if (!feedback) {
            return res.status(400).json({ message: "Feedback is required" });
        }
        const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
        console.log("Feedback submitted successfully");
        res.status(200).json({ message: "Feedback submitted successfully" });
    }
    catch (error) {
        console.error("Error sending feedback email:", error);
        res.status(500).json({ message: "Error sending feedback email" });
    }
});
exports.sendFeedbackEmail = sendFeedbackEmail;
