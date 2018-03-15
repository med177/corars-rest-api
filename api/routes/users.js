const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')

const UsersController=require('../controllers/users')

router.get('/', checkAuth, UsersController.GetAll)

router.get('/:userId', checkAuth, UsersController.GetById)

router.post('/signup', UsersController.SignUp)

router.post('/login', UsersController.Login)

router.patch('/:userId', checkAuth, UsersController.Update)

router.delete('/:userId', checkAuth, UsersController.Delete)

module.exports = router