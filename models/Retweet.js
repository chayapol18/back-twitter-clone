module.exports = (sequelize, DataTypes) => {
  const Retweet = sequelize.define(
    "Retweet",
    {
      content: DataTypes.STRING,
    },
    {
      underscored: true,
      updatedAt: false,
    }
  );

  Retweet.associate = (models) => {
    Retweet.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Retweet.belongsTo(models.Tweet, {
      foreignKey: {
        name: "tweetId",
      },
      OnUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Retweet;
};
