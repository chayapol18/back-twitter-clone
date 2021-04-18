module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define(
        'Follow',
        {

        },
        {
            underscored: true
        }
    )

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, {
            as: 'Following',
            foreignKey: {
                name: 'followingUserId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Follow.belongsTo(models.User, {
            as: 'FollowBy',
            foreignKey: {
                name: 'followByUserId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })
    }

    return Follow
}