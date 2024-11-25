const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidator } = require('../middlewares/validator');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productValidator.create, productController.create);
router.put('/:id', productValidator.update, productController.update);
router.delete('/:id', productController.delete);
router.patch('/:id/stock', productValidator.updateStock, productController.updateStock);

module.exports = router;