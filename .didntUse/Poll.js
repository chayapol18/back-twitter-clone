module.exports = (sequelize, DataTypes) => {
    const Poll = sequelize.define(
        'Poll',
        {
            
        },
        {
            underscored: true
        }
    )

    Poll.associate = (models) => {
        Poll.hasMany(models.Tweet, {
            as: 'mainTweet',
            foreignKey: {
                name: 'tweetId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Poll.belongsTo(models.Tweet, {
            as: 'PollTweet',
            foreignKey: {
                name: 'PollTweetId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })
    }


    return Poll
}