const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { saleValidator } = require('../middlewares/validator');

router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.post('/', saleValidator.create, saleController.create);
router.patch('/:id/status', saleValidator.updateStatus, saleController.updateStatus);
router.post('/:id/cancel', saleController.cancel);

module.exports = router;