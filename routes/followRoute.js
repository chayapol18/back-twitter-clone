const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const followController = require('../controllers/followController')

router.get('/following',
userController.protect,
followController.getFollowing
)

router.get('/follow-by',
userController.protect,
followController.getFollowBy
)

router.get('/number-of-following',
userController.protect,
followController.getNumberOfFollowing
)

router.get('/number-of-follower',
userController.protect,
followController.getNumberOfFollower
)

router.post('/follow-to/:id',
userController.protect,
followController.requestFollow
)

router.delete('/:id',
userController.protect,
followController.unfollow
)

module.exports = router