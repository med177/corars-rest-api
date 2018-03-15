const multer = require('multer')

//const upload = multer({dest:'uploads/'}) //sadece bu şekilde de klasör oluşup dosya aktarılıyor.
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
		cb(null, true)
	} else {
		cb(null, false) //cb(new Error('I don\'t have a clue!'))  -- eğer hata fırlatmak istersek.
	}
}

exports.Upload = multer({
	//dest: 'uploads/',
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5 //5mb
	},
	fileFilter: fileFilter
})