const Joi = require('joi');
const { Usuario, Capturado, Pokemon } = require('../baseDatos/index');

// ================= VALIDACIÓN =================
const validadorRegistro = Joi.object({
  cedula: Joi.string().min(6).max(15).required(),
  email: Joi.string().email().required(),
  nombre: Joi.string().min(2).max(50).required(),
  edad: Joi.number().integer().min(18).max(100).required()
});

// ================= REGISTRAR =================
const registrarUsuario = async (req, res) => {
  try {
    const { error } = validadorRegistro.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", resultado: error.details.map(e => e.message) });
    }

    const { cedula, email, nombre, edad } = req.body;
    const existe = await Usuario.findByPk(cedula);

    if (existe) return res.status(400).json({ mensaje: "El usuario ya existe" });

    const nuevo = await Usuario.create({ cedula, email, nombre, edad, activo: true });
    res.status(201).json({ mensaje: "Usuario creado", resultado: nuevo });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

// ================= LISTAR =================
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { activo: true }, 
      include: [{
        model: Capturado,
        as: 'Capturados',
        include: [{ model: Pokemon, as: 'Pokemon' }]
      }]
    });
    res.status(200).json({ resultado: usuarios });
  } catch (e) {
    res.status(500).json({ mensaje: "Error al listar: " + e.message });
  }
};

// ================= ACTUALIZAR =================
const actualizarUsuario = async (req, res) => {
  try {
    const { cedula } = req.params;
    const [updated] = await Usuario.update(req.body, { where: { cedula } });
    
    if (!updated) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const actualizado = await Usuario.findByPk(cedula);
    res.status(200).json({ mensaje: 'Usuario actualizado', resultado: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// ================= BORRAR =================
const borrarUsuario = async (req, res) => {
  try {
    const { cedula } = req.params; 


    const borrados = await Usuario.destroy({ where: { cedula } });

    if (borrados === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al borrar: " + err.message });
  }
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  actualizarUsuario,
  borrarUsuario
};