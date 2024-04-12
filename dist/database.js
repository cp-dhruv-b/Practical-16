"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
    database: process.env.DB_NAME || "ecom",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    dialect: "postgres",
});
exports.sequelize
    .authenticate()
    .then(() => {
    console.log("Database connection has been established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
exports.default = exports.sequelize;
