import { DataTypes } from "sequelize";

const userPowerUpModel = (sequelize) => {
  const UserPowerUp = sequelize.define("UserPowerUp", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usedAt: {
      type: DataTypes.DATE,
    },
  });

  return UserPowerUp;
};

export default userPowerUpModel;
