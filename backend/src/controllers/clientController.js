const { Client, Sale } = require('../models');

const clientController = {
  // Obtener todos los clientes
  async getAll(req, res, next) {
    try {
      const clients = await Client.findAll();
      res.json(clients);
    } catch (error) {
      next(error);
    }
  },

  // Obtener un cliente por ID
  async getById(req, res, next) {
    try {
      const client = await Client.findByPk(req.params.id, {
        include: [{
          model: Sale,
          as: 'sales',
          attributes: ['id', 'total', 'status', 'createdAt']
        }]
      });
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      res.json(client);
    } catch (error) {
      next(error);
    }
  },

  // Crear un nuevo cliente
  async create(req, res, next) {
    try {
      const { name, email, phone, address } = req.body;
      const client = await Client.create({
        name,
        email,
        phone,
        address
      });
      
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar un cliente
  async update(req, res, next) {
    try {
      const { name, email, phone, address } = req.body;
      const client = await Client.findByPk(req.params.id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      await client.update({
        name,
        email,
        phone,
        address
      });
      
      res.json(client);
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un cliente
  async delete(req, res, next) {
    try {
      const client = await Client.findByPk(req.params.id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      await client.destroy();
      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = clientController;