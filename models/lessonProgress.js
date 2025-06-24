import { DataTypes } from "sequelize";

export default (sequelize) => {
  const LessonProgress = sequelize.define("LessonProgress", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
  });

  return LessonProgress;
};
