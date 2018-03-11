const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const atlasUrl = 'mongodb://med:' + process.env.MONGO_ATLAS_PWD + '@cluster0-shard-00-00-zphz1.mongodb.net:27017,cluster0-shard-00-01-zphz1.mongodb.net:27017,cluster0-shard-00-02-zphz1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
const xenUrl = 'mongodb://med:' + process.env.MONGO_XEN_PWD + '@213.159.7.191:27017/test';

mongoose.connect(atlasUrl);
//mongoose.Promise=global.Promise;//bunun neden yazıldığını bilmiyorum bir hatanın düzeltilmesi için

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//CORS önleme kodu
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');//herhangi bir domainden girilebilsin
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
})

//isteklerin geleceği routelar
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/uploads',express.static('uploads'))

app.use((req, res, next) => {
	const error = new Error('Bulunamadı');
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})

})

/*
app.use((req,res,next)=>{
	res.status(200).json({
		message:'çalışıyor',
	})
});
*/

module.exports = app;