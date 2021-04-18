const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/personal',
userController.protect,
userController.personal
)

router.put('/update-profile',
userController.protect,
userController.update
)

router.patch('/change-password',
userController.protect,
userController.changePassword
)

module.exports = router