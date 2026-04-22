require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const definePokemon = require('../modelos/pokemon');
const defineUsuario = require('../modelos/usuario');
const definePokemonCapturado = require('../modelos/pokemonCapturado');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false 
  }
);

// ================= MODELOS =================
const Usuario = defineUsuario(sequelize, DataTypes);
const Pokemon = definePokemon(sequelize, DataTypes);
const Capturado = definePokemonCapturado(sequelize, DataTypes);

// ================= RELACIONES =================

Usuario.hasMany(Capturado, {
  as: 'Capturados',
  foreignKey: 'usuarioCedula',
  sourceKey: 'cedula',
  onDelete: 'CASCADE' 
});

Capturado.belongsTo(Usuario, {
  foreignKey: 'usuarioCedula',
  targetKey: 'cedula'
});

Pokemon.hasMany(Capturado, {
  as: 'Capturas', 
  foreignKey: 'pokemonId',
  sourceKey: 'id'
});

Capturado.belongsTo(Pokemon, {
  as: 'Pokemon', 
  foreignKey: 'pokemonId',
  targetKey: 'id'
});

// ================= CONEXIÓN =================
sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('Error conexión BD:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('Sincronización completada.'))
  .catch(err => console.error('Error sincronización:', err));

// ================= EXPORT =================
module.exports = {
  Usuario,
  Pokemon,
  Capturado,
  sequelize
};