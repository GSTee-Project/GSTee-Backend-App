import Sequelize from "sequelize";
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
const User = userModel(sequelize);
const Slide = slideModel(sequelize);
const LessonProgress = lessonProgressModel(sequelize);
const Heart = heartModel(sequelize);
const GameSession = gameSessionModel(sequelize);
const Badge = badgeModel(sequelize);
const UserBadge = userBadgeModel(sequelize);
const PowerUp = powerUpModel(sequelize);
const UserPowerUp = userPowerUpModel(sequelize);
const GCoinTransaction = gCoinTransactionModel(sequelize);

// Associations

// User ↔ LessonProgress
User.hasMany(LessonProgress, { foreignKey: "userId" });
LessonProgress.belongsTo(User, { foreignKey: "userId" });

// User ↔ Heart
User.hasMany(Heart, { foreignKey: "userId" });
Heart.belongsTo(User, { foreignKey: "userId" });

// User ↔ GameSession
User.hasMany(GameSession, { foreignKey: "userId" });
GameSession.belongsTo(User, { foreignKey: "userId" });

// Slide ↔ LessonProgress
Slide.hasMany(LessonProgress, { foreignKey: "slideId" });
LessonProgress.belongsTo(Slide, { foreignKey: "slideId" });

// User ↔ UserBadge
User.hasMany(UserBadge, { foreignKey: "userId" });
UserBadge.belongsTo(User, { foreignKey: "userId" });

// Badge ↔ UserBadge
Badge.hasMany(UserBadge, { foreignKey: "badgeId" });
UserBadge.belongsTo(Badge, { foreignKey: "badgeId" });

// User ↔ UserPowerUp
User.hasMany(UserPowerUp, { foreignKey: "userId" });
UserPowerUp.belongsTo(User, { foreignKey: "userId" });

// PowerUp ↔ UserPowerUp
PowerUp.hasMany(UserPowerUp, { foreignKey: "powerUpId" });
UserPowerUp.belongsTo(PowerUp, { foreignKey: "powerUpId" });

// User ↔ GCoinTransaction
User.hasMany(GCoinTransaction, { foreignKey: "userId" });
GCoinTransaction.belongsTo(User, { foreignKey: "userId" });

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
};
