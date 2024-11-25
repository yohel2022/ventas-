const { Sale, SaleDetail, Product, Client, Category, sequelize } = require('../models');

const includes = [
    {
      model: Client,
      as: 'client',
      attributes: ['id', 'name', 'email', 'phone', 'address'],
      required: false
    },
    {
      model: SaleDetail,
      as: 'details',
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock'],
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      }]
    }
  ];

const saleController = {
  // Obtener todas las ventas
  async getAll(req, res, next) {
    try {
      const sales = await Sale.findAll({
        include: includes
      });
      res.json(sales);
    } catch (error) {
      next(error);
    }
  },

  // Obtener una venta por ID
  async getById(req, res, next) {
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: includes
      });
      
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }
      
      res.json(sale);
    } catch (error) {
      next(error);
    }
  },

  // Crear una nueva venta
  async create(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { clientId, items } = req.body;

      // Verificar existencia del cliente
      const client = await Client.findByPk(clientId);
      if (!client) {
        throw new Error('Client not found');
      }

      // Calcular el total y verificar stock
      let total = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        total += product.price * item.quantity;
      }

      // Crear la venta
      const sale = await Sale.create({
        clientId,
        total,
        status: 'PENDING'
      }, { transaction: t });

      // Crear los detalles de la venta y actualizar stock
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        await SaleDetail.create({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity
        }, { transaction: t });

        // Actualizar stock
        await product.update({
          stock: product.stock - item.quantity
        }, { transaction: t });
      }

      await t.commit();
      
      // Retornar la venta con sus detalles
      const createdSale = await Sale.findByPk(sale.id, {
        include: includes
      });
      
      res.status(201).json(createdSale);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  },

  // Actualizar estado de una venta
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const sale = await Sale.findByPk(req.params.id);
      
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      await sale.update({ status });
      res.json(sale);
    } catch (error) {
      next(error);
    }
  },

  // Cancelar una venta
  async cancel(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: [{ model: SaleDetail, as: 'details' }]
      });
      
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      if (sale.status === 'CANCELLED') {
        return res.status(400).json({ message: 'Sale is already cancelled' });
      }

      // Restaurar stock
      for (const detail of sale.SaleDetails) {
        const product = await Product.findByPk(detail.productId);
        await product.update({
          stock: product.stock + detail.quantity
        }, { transaction: t });
      }

      await sale.update({ status: 'CANCELLED' }, { transaction: t });

      await t.commit();
      res.json({ message: 'Sale cancelled successfully' });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
};

module.exports = saleController;