// models/User.js
const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Sequelize built-in email validation
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
      },
      courseofstudy: {
        type: DataTypes.STRING,
      },

      // Verification system
      verificationCodeHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationCodeExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verificationAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // Brute-force login protection
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["email"] }],
      tableName: "Users", // optional but recommended for naming consistency
    }
  );

  return User;
};

export default userModel;
