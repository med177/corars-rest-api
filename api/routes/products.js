const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

router.get('/', (req, res, next) => {
	Product
		.find() //.limit(100)
		.exec()
		.then(docs => {
			console.log('Veritabanı\'ndan', docs);
			if (docs.length >= 0) {
				res.status(200).json(docs);
			} else {
				res.status(404).json({
					message: 'Hiç Kayıt yok'
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
	res.status(200).json({
		message: '/products GET isteği geldi',
	})
	*/
});

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
	});

	product
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: '/products POST isteği geldi',
				createdProduct: result,
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
	/*
	const product = {
		name: req.body.name,
		price: req.body.price
	}

	res.status(201).json({
		message: '/products POST isteği geldi',
		createdProduct: product,
	})
	*/
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product
		.findById(id)
		.exec()
		.then(doc => {
			console.log('Veritabanı\'ndan', doc);
			if (doc) {
				res.status(200).json(doc);
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
			message: '/products/:id GET isteği geldi, Özel',
			id: id
		})
	} else {
		res.status(200).json({
			message: '/products/:id GET isteği geldi, Standart',
			id: id
		})
	}
	*/
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;
	//{name: req.body.name, price: req.body.price}//{name:'Kaldırımlar',price: 10.00}
	const updateOps = {};
	for (const ops of req.body) { //sending body must be => [{"propName":"name", "value":"Yukarı Köy"}]
		updateOps[ops.propName] = ops.value;
	}

	Product
		.update({ _id: id }, { $set: updateOps }) //findByIdAndUpdate(id, { $set: { name: 'test', price: 12.99 } })
		.exec()
		.then(result => {
			console.log('Değişen', result);
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		})
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product
		.remove({ _id: id })
		.exec()
		.then(result => {
			console.log('Silinen', result);
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		})
});

module.exports = router;