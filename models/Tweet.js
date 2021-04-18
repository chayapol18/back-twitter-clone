module.exports = (sequelize, DataTypes) => {
    const Tweet = sequelize.define(
        'Tweet', 
        {
            levelTweetId: {
                type: DataTypes.ENUM,
                values: ['1', '2', '3'],
                allowNull: false
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            img1: DataTypes.STRING,
            img2: DataTypes.STRING,
            img3: DataTypes.STRING,
            img4: DataTypes.STRING,
            like: DataTypes.INTEGER,
            retweets: DataTypes.INTEGER,
        },
        {
            underscored: true,
            updatedAt: false
        }
    )

    Tweet.associate = (models) => {
        Tweet.hasMany(models.Tweet, {
            as: 'replyTo',
            foreignKey: {
                name: 'replyToTweetId'
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Tweet.hasMany(models.Retweet, {
            foreignKey: {
                name: 'tweetId'
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Tweet.hasMany(models.Bookmark, {
            foreignKey: {
                name: 'tweetId'
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Tweet.belongsTo(models.User, {
            foreignKey: {
                name: 'userId'
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })
        
    }

    return Tweet
}