const { Capturado, Pokemon } = require('../baseDatos');

const capturarPokemon = async (req, res) => {
  try {
    const { pokemonId, usuarioCedula, nombre, tipo } = req.body; 

    const [pokemon] = await Pokemon.findOrCreate({
      where: { pokeApiId: pokemonId },
      defaults: { 
        pokeApiId: pokemonId, 
        nombre: nombre, 
        tipo: tipo, 
        poder: "100" 
      }
    });

    const capturado = await Capturado.create({ 
      pokemonId: pokemon.id, 
      usuarioCedula 
    });

    res.status(201).json({ mensaje: "Pokémon capturado", resultado: capturado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const listarPokemonesUsuario = async (req, res) => {
  try {
    const { usuarioCedula } = req.params;

    const pokemones = await Capturado.findAll({
      where: { usuarioCedula },
      include: [
        {
          model: Pokemon,
          attributes: ['id', 'nombre', 'tipo', 'poder']
        }
      ]
    });

    res.status(200).json({
      mensaje: "Pokémon del usuario",
      resultado: pokemones
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

module.exports = { capturarPokemon, listarPokemonesUsuario };