const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

router.get('/',
userController.protect,
tweetController.getAllTweets
)

router.get('/personal',
userController.protect,
tweetController.getUserTweets
)

router.get('/inc-reply',
userController.protect,
tweetController.getTweetsIncReply
)

router.get('/bookmarks',
userController.protect,
tweetController.getTweetsInBookmark
)

router.post('/bookmark',
userController.protect,
tweetController.addBookmark
)

router.post('/',
userController.protect,
tweetController.addTweet
)

router.delete('/:id',
userController.protect,
tweetController.deleteTweet
)

router.delete('/bookmarks/:id',
userController.protect,
tweetController.deleteBookmark
)

module.exports = router