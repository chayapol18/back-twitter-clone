module.exports = (sequelize, DataTypes) => {
    const Block = sequelize.define(
        'Block',
        {

        },
        {
            underscored: true
        }
    )

    Block.associate = (models) => {
        Block.belongsTo(models.User, {
            as: 'Blocking',
            foreignKey: {
                name: 'blockingUserId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })

        Block.belongsTo(models.User, {
            as: 'BlockBy',
            foreignKey: {
                name: 'blockByUserId',
                allowNull: false
            },
            OnUpdate: 'RESTRICT',
            onDelete: 'RESTRICT' 
        })
    }


    return Block
}