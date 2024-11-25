const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { clientValidator } = require('../middlewares/validator');

router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/', clientValidator.create, clientController.create);
router.put('/:id', clientValidator.update, clientController.update);
router.delete('/:id', clientController.delete);

module.exports = router;