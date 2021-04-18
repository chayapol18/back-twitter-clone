const { Tweet, Bookmark, Follow, User } = require('../models')

exports.getUserTweets = async (req, res, next) => {
    try {
        const tweets = await Tweet.findAll({ 
            where: { userId: req.user.id },
            order: [['createdAt', 'desc']],
            include: {
                model: User,
                attributes: ['id', 'name', 'username', 'profileImg']
            },
            attributes: ['id', 'content', 'createdAt']
        })

        res.status(200).json({ tweets })
    } catch(err) {
        next(err)
    }
}

exports.getAllTweets = async (req, res, next) => {
    try {
        const requestToFollowId = await Follow.findAll({
            where: {
                followByUserId: req.user.id,
            },
            attributes: ['followingUserId']
        })
        // ใช้ .then() map ต่อได้ แต่ไม่ควรใช้ปนกัน

        const toIds = requestToFollowId.map(item => {
            return item.followingUserId
        })
        console.log(JSON.parse(JSON.stringify(requestToFollowId)))
        console.log(toIds)

        const followsIncludeMe =  [req.user.id, ...toIds]

        const tweets = await Tweet.findAll({
            where: { userId: followsIncludeMe },
            order: [['createdAt', 'desc']],
            include: {
                model: User,
                attributes: ['id', 'name', 'username', 'profileImg']
            },
            attributes: ['id', 'content', 'createdAt']
        })
        res.status(200).json({ tweets })

    } catch(err) {
        next(err)
    }
}

exports.getTweetsIncReply = async (req, res, next) => {
    try {
        const tweet = await Tweet.findOne({ where: { id } })

        const tweetWithReply = await Tweet.findAll({
            where: {
                userId: req.user.id
            },
            include: {
                model: Tweet,
                as: 'replyTo',
                where: {
                    replyToTweetId: tweets.id,
                    levelTweetId: 2
                }
            }
        })

        res.status(200).json({ tweetWithReply })

    } catch(err) {
        next(err)
    }
}

exports.getTweetsInBookmark = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll({
            where: {
                userId: req.user.id,
            },
            attributes: [],
            order: [['createdAt', 'desc']],
            include: {
                model: Tweet,
                order: [['createdAt', 'desc']],
                include: {
                    model: User,
                    attributes: ['id', 'name', 'username', 'profileImg']
                },
                
                attributes: ['id', 'content', 'createdAt']
            }
        })
        
        res.status(200).json({ tweets: bookmarks })

    } catch(err) {
        next(err)
    }
}

exports.addTweet = async (req, res, next) => {
    try {
        const { content, levelTweetId, replyToTweetId } = req.body
        const tweet = await Tweet.create({
            levelTweetId,
            userId: req.user.id,
            content,
            replyToTweetId,
        })

        res.status(201).json({ tweet })
    } catch(err) {
        next(err)
    }
}

exports.addBookmark = async (req, res, next) => {
    try {
        const { tweetId } = req.body
        const tweet = await Tweet.findOne({ where: { id: tweetId } })
        if(!tweet) return res.status(400).json({ message: 'tweet is not found' })

        const tweetInBookmark = await Bookmark.findOne({ where: { tweetId } })
        if(tweetInBookmark) return res.status(400).json({ message: 'you already bookmark this tweet' })

        const bookmark = await Bookmark.create({
            tweetId,
            userId: req.user.id,
        })

        res.status(201).json({ bookmark })
    } catch(err) {
        next(err)
    }
}

exports.deleteTweet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tweet = await Tweet.findOne({ where: { id } });
        if(!tweet) return res.status(400).json({ message: 'tweet not found'}) 
        if(tweet.userId !== req.user.id) return res.status(400).json({ message: `cannot delete other user's tweet`})

        await tweet.destroy()

        res.status(204).json()
    } catch(err) {
        next(err)
    }
}

exports.deleteBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bookmark = await Bookmark.findOne({ where: { tweetId: id, userId: req.user.id } });
        if(!bookmark) return res.status(400).json({ message: 'bookmark not found'}) 
        if(bookmark.userId !== req.user.id) return res.status(400).json({ message: `cannot delete other user's bookmark`})

        await bookmark.destroy()

        res.status(204).json()
    } catch(err) {
        next(err)
    }
}