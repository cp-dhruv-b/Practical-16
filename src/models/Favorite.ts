import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

class Favorite extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
}

Favorite.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    sequelize,
    modelName: "favorite",
  }
);

export default Favorite;
