const { Block, Follow, User, sequelize  } = require('../models')
const { Op } = require('sequelize')

exports.getBlocking = async (req, res, next) => {
    try {
        const blocking = await Block.findAll({
            where: {
                blockByUserId: req.user.id
            },
            include: {
                model: User,
                as: 'Blocking',
                attributes: ['name', 'username', 'bio', 'profileImg']
            }
        })

        res.status(200).json({ blocking })

    } catch(err) {
        next(err)
    }
}

exports.blockUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {

        const { blockingUserId } = req.body;
        if (req.user.id === Number(blockingUserId)) return res.status(400).json({ message: 'cannot block yourself'})

        const block = await Block.findOne({ 
            where: {
                    blockingUserId,
                    blockByUserId: req.user.id
                }
        })
        if(block) return res.status(400).json({ message: 'you already block this user'})

        await Block.create({
            blockingUserId,
            blockByUserId: req.user.id,
        }, {transaction})
        
        await Follow.destroy(
            { 
                where: {
                    followingUserId: blockingUserId, 
                    followByUserId: req.user.id
                }
            },
            {transaction}
        )

        await Follow.destroy(
            { 
                where: {
                    followingUserId: req.user.id, 
                    followByUserId: blockingUserId
                }
            },
            {transaction}
        )

        await transaction.commit();
        res.status(201).json({ message: "you are blocking this user" })

        // const following = await Follow.findOne({ 
        //     where: { 
        //         followingUserId: blockingUserId, 
        //         followByUserId: req.user.id
        //     }
        // })
        // if (following) return await following.destroy({ where: {} }, {transaction})

        // const follower = await Follow.findOne({ 
        //     where: { 
        //         followingUserId: req.user.id, 
        //         followByUserId: blockingUserId
        //     }
        // })
        // if (follower) return await follower.destroy({ where: {} }, {transaction})

    } catch(err) {
        await transaction.rollback()
        next(err)
    }
}

exports.unBlock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const block = await Block.findOne({ 
            where: { 
                blockingUserId: id,
                blockByUserId: req.user.id
            }
        })
        if (!block) return res.status(400).json({ message: 'you are not blocking this user' })

        await block.destroy()
        res.status(204).json()

    } catch(err) {
        next(err)
    }
}