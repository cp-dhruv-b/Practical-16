import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

class Category extends Model {
  public id!: number;
  public name!: string;
  public parentId?: string;
}

Category.init(
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
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "Category",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "category",
  }
);

export default Category;
