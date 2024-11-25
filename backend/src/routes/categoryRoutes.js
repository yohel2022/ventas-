const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { categoryValidator } = require('../middlewares/validator');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryValidator.create, categoryController.create);
router.put('/:id', categoryValidator.update, categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;