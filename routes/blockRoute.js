const express = require('express')
const router = express.Router()
const blockController = require('../controllers/blockController')
const userController = require('../controllers/userController')

router.get('/',
userController.protect,
blockController.getBlocking
)

router.post('/',
userController.protect,
blockController.blockUser
)

router.delete('/:id',
userController.protect,
blockController.unBlock
)

module.exports = router