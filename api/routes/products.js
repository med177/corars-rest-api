const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const FileUpload = require('../middleware/file-upload')

const ProductsController = require('../controllers/products')

router.get('/', checkAuth, ProductsController.GetAll)

router.get('/:productId', checkAuth, ProductsController.GetById)

router.post('/', checkAuth, FileUpload.Upload.single('productImage'), ProductsController.Add)

router.patch('/:productId', checkAuth, ProductsController.Update)

router.delete('/:productId', checkAuth, ProductsController.Delete)

module.exports = router