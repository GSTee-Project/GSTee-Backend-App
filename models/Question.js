import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Question = sequelize.define("Question", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false, // Example: ["A", "B", "C", "D"]
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("mcq", "puzzle", "dragDrop"),
      allowNull: false,
    },
  });

  return Question;
};
