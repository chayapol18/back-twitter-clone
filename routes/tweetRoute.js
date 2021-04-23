const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

router.get('/personal',
userController.protect,
tweetController.getUserTweets
)

router.get('/inc-reply/:id',
userController.protect,
tweetController.getTweetsIncReply
)

router.get('/get-retweets-tweet/:id',
userController.protect,
tweetController.getTweetInRetweets
)

router.get('/bookmarks',
userController.protect,
tweetController.getTweetsInBookmark
)

router.get('/',
userController.protect,
tweetController.getAllTweets
)

router.post('/retweet',
userController.protect,
tweetController.retweet
)

router.post('/bookmark',
userController.protect,
tweetController.addBookmark
)

router.post('/',
userController.protect,
tweetController.addTweet
)

router.patch('/increase-like',
userController.protect,
tweetController.increaseLike
)

router.patch('/increase-retweet',
userController.protect,
tweetController.increaseRetweet
)

router.patch('/decrease-retweet',
userController.protect,
tweetController.decreaseRetweet
)

router.delete('/:id',
userController.protect,
tweetController.deleteTweet
)

router.delete('/retweet/:id',
userController.protect,
tweetController.cancelRetweet
)

router.delete('/bookmarks/:id',
userController.protect,
tweetController.deleteBookmark
)

module.exports = router