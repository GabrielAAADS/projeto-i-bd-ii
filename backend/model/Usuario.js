const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
  codinome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  afiliacao: {
    type: DataTypes.ENUM('Império', 'Cartel Hutt', 'Aurora Escarlate', 'Sindicato Pyke'),
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  hooks: {
    beforeSave: async (usuario) => {
      if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(usuario.senha, salt);
        usuario.senha = hash;
      }
    }
  }
});

Usuario.prototype.comparePassword = async function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;
