const { Category } = require('../models');

const categoryController = {
  // Obtener todas las categorías
  async getAll(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  // Obtener una categoría por ID
  async getById(req, res, next) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Crear una nueva categoría
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar una categoría
  async update(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await Category.findByPk(req.params.id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.update({ name, description });
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Eliminar una categoría
  async delete(req, res, next) {
    try {
      const category = await Category.findByPk(req.params.id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.destroy();
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;