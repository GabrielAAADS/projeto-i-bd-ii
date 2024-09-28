const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const { randomUUID } = require('crypto');

const PontoDeInteresse = sequelize.define('PontoDeInteresse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
  },
  tipo: {
    type: DataTypes.ENUM(
      'Ponto de Interesse', 'Tesouro', 'Pista', 'Inimigo Imperial', 'Base Imperial',
      'Aliado Imperial', 'Inimigo Hutt', 'Base Hutt', 'Aliado Hutt', 
      'Comerciante', 'Caçador de Recompensas', 'Avistamento de Jedi'
    ),
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  pontoDeInteresse: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  }
}, {
  tableName: 'pontos_de_interesse',
  indexes: [
    {
      fields: ['titulo', 'descricao'],
      using: 'btree',
    },
    {
      fields: ['pontoDeInteresse'],
      using: 'gist',
    },
  ]
});

module.exports = PontoDeInteresse;
