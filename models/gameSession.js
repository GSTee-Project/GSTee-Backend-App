import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GameSession = sequelize.define("GameSession", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gameMode: {
      type: DataTypes.ENUM("TimeAttack", "Battle", "BossFight"),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    result: {
      type: DataTypes.ENUM("win", "loss"),
    },
    playedAt: {
      type: DataTypes.DATE,
    },
    // 🔑 Explicit FK column (unique name to avoid constraint clashes)
    gameSessionUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return GameSession;
};
