const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();
const authMiddleware = require('../middleware/isAuth');
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if uploaded file is a CSV
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
})

router.post(
	'/upload',
	upload.single('file'),
    authMiddleware,
	UserController.upload
);

router.get(
    '/getUploads',
    authMiddleware,
    UserController.getUploads
)

router.get(
    '/getTenureData',
    authMiddleware,
    UserController.getTenureData
)

router.get(
    '/getComparisonData',
    authMiddleware,
    UserController.getComparisonData
)

router.get(
    '/getCompanyData',
    authMiddleware,
    UserController.getCompanyData
)

module.exports = router;