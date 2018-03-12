const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = (req, res, next) => {
	try {
		const cert = fs.readFileSync('./private.key')
		const token = req.headers.authorization.split(' ')[1] //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp
		const decoded = jwt.verify(token, cert)
		req.userData = decoded
		next()
	} catch (err) {
		return res.status(401).json({
			message: 'Kimlik doğrulama geçersiz !',
			error: err
		})
	}
}