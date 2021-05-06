module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImg: DataTypes.STRING,
      backgroundImg: DataTypes.STRING,
      bio: DataTypes.STRING,
      gender: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Tweet, {
      foreignKey: {
        name: "userId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Follow, {
      as: "Following",
      foreignKey: {
        name: "followingUserId",
        allowNull: false,
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Follow, {
      as: "FollowBy",
      foreignKey: {
        name: "followByUserId",
        allowNull: false,
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Block, {
      as: "Blocking",
      foreignKey: {
        name: "blockingUserId",
        allowNull: false,
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Block, {
      as: "BlockBy",
      foreignKey: {
        name: "blockByUserId",
        allowNull: false,
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Retweet, {
      foreignKey: {
        name: "userId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Bookmark, {
      foreignKey: {
        name: "userId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return User;
};
