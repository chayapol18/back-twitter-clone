module.exports = (sequelize, DataTypes) => {
    const Reply = sequelize.define(
        'Reply',
        {
            
        },
        {
            underscored: true
        }
    )

    Reply.associate = (models) => {
        Reply.belongsTo(models.Tweet, {
            as: 'mainTweet',
            foreignKey: {
                name: 'tweetId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Reply.belongsTo(models.Tweet, {
            as: 'replyTweet',
            foreignKey: {
                name: 'replyTweetId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })
    }


    return Reply
}