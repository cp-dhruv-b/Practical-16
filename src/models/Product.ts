import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";
import Category from "./Category";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: string;
  public categoryId!: number;
  public subcategoryId!: number; 
  public photo!: string | null; 

}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    subcategoryId: {
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: {
        model: Category,
        key: "id",
      },
    },
    photo: {
      type: DataTypes.STRING, 
      allowNull: true, 
    },
  },
  {
    sequelize,
    modelName: "product",
  }
);

export default Product;
