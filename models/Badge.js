import { DataTypes } from "sequelize";

const badgeModel = (sequelize) => {
  const Badge = sequelize.define("Badge", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirement: {
      type: DataTypes.TEXT,
    },
    levelRequired: {
      type: DataTypes.INTEGER,
    },
  });

  return Badge;
};

export default badgeModel;
