import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Heart = sequelize.define("Heart", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastMilestone: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    lastEarnedAt: {
      type: DataTypes.DATE,
    },
  });

  return Heart;
};
