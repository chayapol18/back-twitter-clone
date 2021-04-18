const { Follow, User } = require('../models')

exports.getFollowing = async (req, res, next) => {
    try {
        const following = await Follow.findAll({ 
            where: { followByUserId: req.user.id },
            include: {
                model: User,
                as: 'Following',
                attributes: ['name', 'username', 'bio', 'profileImg']
            },
            attributes: []
         }) 

        res.status(200).json({ following })
    } catch (err) {
        next(err)
    }
}

exports.getFollowBy = async (req, res, next) => {
    try {
        const followBy = await Follow.findAll({ 
            where: { followingUserId: req.user.id },
            include: {
                model: User,
                as: 'FollowBy',
                attributes: ['name', 'username', 'bio', 'profileImg']
            },
            attributes: [] 
        }) 

        res.status(200).json({ followBy })
    } catch(err) {
        next(err)
    }
}

exports.getNumberOfFollowing = async (req, res, next) => {
    try {
        const following = await Follow.findAndCountAll({
            where: {
               followByUserId: req.user.id
            }
        })

        res.status(200).json({ following })

    } catch(err) {
        next(err)
    }
}

exports.getNumberOfFollower = async (req, res, next) => {
    try {
        const follower = await Follow.findAndCountAll({
            where: {
                followingUserId: req.user.id
            }
        })

        res.status(200).json({ follower })

    } catch(err) {
        next(err)
    }
}

exports.requestFollow = async (req, res, next) => {
    try {
        const { followingUserId } = req.body;
        if (req.user.id === Number(followingUserId)) return res.status(400).json({ message: 'cannot follow yourself'})

        const follow = await Follow.findOne({ 
            where: {
                    followingUserId,
                    followByUserId: req.user.id
                }
        })
        
        if(follow) return res.status(400).json({ message: 'you already follow this user'})

        await Follow.create({
            followingUserId,
            followByUserId: req.user.id,
        })
        
        res.status(201).json({ message: 'You are starting to follow this user' })

    } catch(err) {
        next(err)
    }
}

exports.unfollow = async (req, res, next) => {
    try {
        const { id } = req.params;
        const follow = await Follow.findOne({ 
            where: { 
                followingUserId: id,
                followByUserId: req.user.id
            }
        })
        if (!follow) return res.status(400).json({ message: 'you are not follow this user' })

        await follow.destroy()
        res.status(204).json()

    } catch(err) {
        next(err)
    }
}