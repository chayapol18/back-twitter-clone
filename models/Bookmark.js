module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    "Bookmark",
    {},
    {
      underscored: true,
      updatedAt: false,
    }
  );

  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Bookmark.belongsTo(models.Tweet, {
      foreignKey: {
        name: "tweetId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "CASCADE",
    });
  };

  return Bookmark;
};
