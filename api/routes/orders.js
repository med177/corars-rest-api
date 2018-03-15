const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const OrdersController = require('../controllers/orders')

router.get('/', checkAuth, OrdersController.GetAll)

router.get('/:orderId', checkAuth, OrdersController.GetById)

router.post('/', checkAuth, OrdersController.Add)

router.patch('/:orderId', checkAuth, OrdersController.Update)

router.delete('/:orderId', checkAuth, OrdersController.Delete)

module.exports = router