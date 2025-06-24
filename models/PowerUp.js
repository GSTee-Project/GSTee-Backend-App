import { DataTypes } from "sequelize";

const powerUpModel = (sequelize) => {
  const PowerUp = sequelize.define("PowerUp", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    levelUnlock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return PowerUp;
};

export default powerUpModel;
