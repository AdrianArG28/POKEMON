const express = require('express');
const enrutador = express.Router();
const pokemonControlador = require('../controladores/pokemonControlador');

enrutador.get('/listar', pokemonControlador.listarPokemones);

module.exports = enrutador;