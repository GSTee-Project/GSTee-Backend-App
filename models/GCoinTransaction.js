import { DataTypes } from "sequelize";

const gCoinTransactionModel = (sequelize) => {
  const GCoinTransaction = sequelize.define("GCoinTransaction", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("earn", "spend"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return GCoinTransaction;
};

export default gCoinTransactionModel;
