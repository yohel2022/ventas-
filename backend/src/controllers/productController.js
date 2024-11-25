const { Product, Category } = require('../models');

const productController = {
  // Obtener todos los productos
  async getAll(req, res, next) {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, as: 'category', attributes: ['name'] }]
      });
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  // Obtener un producto por ID
  async getById(req, res, next) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category, as: 'category', attributes: ['name'] }]
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // Crear un nuevo producto
  async create(req, res, next) {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        categoryId
      });
      
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar un producto
  async update(req, res, next) {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.update({
        name,
        description,
        price,
        stock,
        categoryId
      });
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un producto
  async delete(req, res, next) {
    try {
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar stock de producto
  async updateStock(req, res, next) {
    try {
      const { stock } = req.body;
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.update({ stock });
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;