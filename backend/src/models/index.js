const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Modelo Category
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true
});

// Modelo Product
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {  // Agregamos la clave foránea explícitamente
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true
});

// Modelo Client
const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'clients',
  timestamps: true
});

// Modelo Sale
const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {  // Agregamos la clave foránea explícitamente
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  observation: {  // Agregamos campo de observación
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sales',
  timestamps: true
});

// Modelo SaleDetail
const SaleDetail = sequelize.define('SaleDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  saleId: {  // Agregamos la clave foránea explícitamente
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sales',
      key: 'id'
    }
  },
  productId: {  // Agregamos la clave foránea explícitamente
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'sale_details',
  timestamps: true
});

// Definir relaciones con alias y claves foráneas explícitas
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Client.hasMany(Sale, {
  foreignKey: 'clientId',
  as: 'sales',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Sale.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

Sale.hasMany(SaleDetail, {
  foreignKey: 'saleId',
  as: 'details',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

SaleDetail.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale'
});

Product.hasMany(SaleDetail, {
  foreignKey: 'productId',
  as: 'saleDetails',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

SaleDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

module.exports = {
  sequelize,
  Category,
  Product,
  Client,
  Sale,
  SaleDetail
};