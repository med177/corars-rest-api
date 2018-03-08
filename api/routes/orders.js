const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
	Order
		.find() //.limit(100)
		.exec()
		.then(docs => {
			//=> arrow function kullanımı" function(s){ return s.length }  ---->  s => s.length
			const mapDocs = docs.map((doc) => {
				return {
					id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: req.method,
						url: req.protocol + '://' + req.headers.host + req.url + 'orders/' + doc._id
					}
				};
			})

			const response = {
				count: docs.length,
				orders: mapDocs
			}
			res.status(200).json(response)
			/*
			if (docs.length >= 0) {
				res.status(200).json(docs);
			} else {
				res.status(404).json({
					message: 'Hiç Kayıt yok'
				});
			}
			*/
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		})
	/*
	res.status(200).json({
		message: '/orders GET isteği geldi',
	})
	*/
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	Order
		.findById(id)
		.select('-__v')//_id name price 
		.exec()
		.then(doc => {
			console.log('Veritabanı\'ndan', doc);
			if (doc) {
				res.status(200).json({
					order: doc,
					request: {
						type: req.method,
						url: req.protocol + '://' + req.headers.host + '/orders' + req.url
					}
				});
			} else {
				res.status(404).json({
					message: 'Bulunamadı ' + id
				});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		})

	/*
	if (id === 'special') {
		res.status(200).json({
			message: '/orders/:id GET isteği geldi, Özel',
			id: id
		})
	} else {
		res.status(200).json({
			message: '/orders/:id GET isteği geldi, Standart',
			id: id
		})
	}
	*/
});

router.post('/', (req, res, next) => {
	//ürün id geçerli mi?
	Product
		.findById(req.body.productId).exec()
		.then(product => {
			if (!product) {//bulunamayınca null geliyor
				res.status(404).json({
					message: 'Ürün Bulunamadı ' + req.body.productId,
				})
			} else {
				const order = new Order({
					_id: new mongoose.Types.ObjectId(),
					product: req.body.productId,
					quantity: req.body.quantity,
				});
				order.save()
					.then(result => {
						console.log(result);
						res.status(201).json({
							message: 'Sipariş Kaydedildi',
							createdOrder: {
								id: result._id,
								product: result.product,
								quantity: result.quantity,
								request: {
									type: req.method,
									url: req.protocol + '://' + req.headers.host + req.url + 'orders/' + result._id
								}
							}
						})
					})
					.catch(err=>{
						console.log(err);
						res.status(500).json({
							error: err
						})
					})
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});

router.patch('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	//{name: req.body.name, price: req.body.price}//{name:'Kaldırımlar',price: 10.00}
	const updateOps = {};
	for (const ops of req.body) { //sending body must be => [{"propName":"name", "value":"Yukarı Köy"}]
		updateOps[ops.propName] = ops.value;
	}
	Order
		.update({ _id: id }, { $set: updateOps }) //findByIdAndUpdate(id, { $set: { name: 'test', price: 12.99 } })
		.exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				message: 'Ürün Bilgileri Güncellendi',
				request: {
					type: req.method,
					url: req.protocol + '://' + req.headers.host + '/orders' + req.url
				}
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	Order
		.remove({ _id: id })
		.exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				message: 'Ürün Silindi',
				request: {
					description: 'Yeni ürün ekleme isteği',
					type: 'POST',
					url: req.protocol + '://' + req.headers.host + '/orders',
					body: {
						name: 'String, reguired',
						price: 'Number, required'
					}
				}
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});

module.exports = router;