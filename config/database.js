import Sequelize, { DataTypes } from "sequelize";
import dotenv from "dotenv";
import userModel from "../models/user.js";
import slideModel from "../models/slide.js";
import lessonProgressModel from "../models/lessonProgress.js";
import heartModel from "../models/heart.js";
import gameSessionModel from "../models/gameSession.js";
import badgeModel from "../models/Badge.js";
import userBadgeModel from "../models/UserBadge.js";
import powerUpModel from "../models/PowerUp.js";
import userPowerUpModel from "../models/UserPowerUp.js";
import gCoinTransactionModel from "../models/GCoinTransaction.js";
import question from "../models/Question.js"; // Import Question model

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

// Initialize models
const User = userModel(sequelize, DataTypes);
const Slide = slideModel(sequelize);
const LessonProgress = lessonProgressModel(sequelize);
const Heart = heartModel(sequelize);
const GameSession = gameSessionModel(sequelize);
const Badge = badgeModel(sequelize);
const UserBadge = userBadgeModel(sequelize);
const PowerUp = powerUpModel(sequelize);
const UserPowerUp = userPowerUpModel(sequelize);
const GCoinTransaction = gCoinTransactionModel(sequelize);
const Question = question(sequelize);

// Associations

// User ↔ LessonProgress
User.hasMany(LessonProgress, {
  foreignKey: { name: "lessonProgressUserId", allowNull: false },
  onDelete: "CASCADE",
});
LessonProgress.belongsTo(User, {
  foreignKey: { name: "lessonProgressUserId", allowNull: false },
  onDelete: "CASCADE",
});

// Slide ↔ LessonProgress
Slide.hasMany(LessonProgress, {
  foreignKey: { name: "lessonProgressSlideId", allowNull: false },
  onDelete: "CASCADE",
});
LessonProgress.belongsTo(Slide, {
  foreignKey: { name: "lessonProgressSlideId", allowNull: false },
  onDelete: "CASCADE",
});

// User ↔ Heart
User.hasMany(Heart, {
  foreignKey: { name: "heartUserId", allowNull: false },
  onDelete: "CASCADE",
});
Heart.belongsTo(User, {
  foreignKey: { name: "heartUserId", allowNull: false },
  onDelete: "CASCADE",
});

// User ↔ GameSession
User.hasMany(GameSession, {
  foreignKey: { name: "gameSessionUserId", allowNull: false },
  onDelete: "CASCADE",
});

GameSession.belongsTo(User, {
  foreignKey: { name: "gameSessionUserId", allowNull: false },
  onDelete: "CASCADE",
});

// User ↔ UserBadge
User.hasMany(UserBadge, {
  foreignKey: { name: "userBadgeUserId", allowNull: false },
  onDelete: "CASCADE",
});
UserBadge.belongsTo(User, {
  foreignKey: { name: "userBadgeUserId", allowNull: false },
  onDelete: "CASCADE",
});

// Badge ↔ UserBadge
Badge.hasMany(UserBadge, {
  foreignKey: { name: "userBadgeBadgeId", allowNull: false },
  onDelete: "CASCADE",
});
UserBadge.belongsTo(Badge, {
  foreignKey: { name: "userBadgeBadgeId", allowNull: false },
  onDelete: "CASCADE",
});

// User ↔ UserPowerUp
User.hasMany(UserPowerUp, {
  foreignKey: { name: "userPowerUpUserId", allowNull: false },
  onDelete: "CASCADE",
});
UserPowerUp.belongsTo(User, {
  foreignKey: { name: "userPowerUpUserId", allowNull: false },
  onDelete: "CASCADE",
});

// PowerUp ↔ UserPowerUp
PowerUp.hasMany(UserPowerUp, {
  foreignKey: { name: "userPowerUpPowerUpId", allowNull: false },
  onDelete: "CASCADE",
});
UserPowerUp.belongsTo(PowerUp, {
  foreignKey: { name: "userPowerUpPowerUpId", allowNull: false },
  onDelete: "CASCADE",
});

// User ↔ GCoinTransaction
User.hasMany(GCoinTransaction, {
  foreignKey: { name: "gcoinTransactionUserId", allowNull: false },
  onDelete: "CASCADE",
});
GCoinTransaction.belongsTo(User, {
  foreignKey: { name: "gcoinTransactionUserId", allowNull: false },
  onDelete: "CASCADE",
});

// Export all models
export {
  sequelize,
  User,
  Slide,
  LessonProgress,
  Heart,
  GameSession,
  Badge,
  UserBadge,
  PowerUp,
  UserPowerUp,
  GCoinTransaction,
  Question,
};
