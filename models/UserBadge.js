import { DataTypes } from "sequelize";

const userBadgeModel = (sequelize) => {
  const UserBadge = sequelize.define("UserBadge", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    earnedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return UserBadge;
};

export default userBadgeModel;
