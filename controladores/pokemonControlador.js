const { Pokemon } = require('../baseDatos');

const listarPokemones = async (req, res) => {
  try {
    const pokemones = await Pokemon.findAll();
    res.status(200).json({ mensaje: "Lista de Pokémon", resultado: pokemones });
  } catch (error) {
    res.status(400).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = {
    listarPokemones
};