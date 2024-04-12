"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    parentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        references: {
            model: "Category",
            key: "id",
        },
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "category",
});
exports.default = Category;
