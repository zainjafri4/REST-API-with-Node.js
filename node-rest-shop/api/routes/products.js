const express = require("express");
const router = express.Router();
const Auth = require('../middleWares/auth');

const productController = require("../controllers/products")


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now(); // Unix timestamp
        cb(null, `${timestamp}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || 'image/jpg' || 'image/png') {
        cb(null, true)
    } else {
        cb(new Error("File Type not Supported"), false)
    }
}


const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})

router.get("/", productController.products_get_all )

router.post("/", Auth, upload.single('productImage'), productController.create_prodcut)

router.get("/:productId", productController.get_product)

router.patch("/:productId", Auth, productController.update_products)

router.delete("/:productId", Auth, productController.delete_prodcut )

module.exports = router;
