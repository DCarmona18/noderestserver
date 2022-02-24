const {response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, role } = req.body;
    const usuario = new Usuario({nombre, correo, password, role});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar base de datos
    await usuario.save();
    
    res.json({
        ok: true,
        usuario
    })
};

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const {password, google, correo, ...body } = req.body;

    //TODO: Validar contra base de datos
    if(password) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, body);

    res.json({
        ok: true,
        msg: 'Put API - controlador',
        usuario
    })
};

const usuariosGet = (req = request, res = response) => {
    const { q , nombre, apikey} = req.query;
    res.json({
        ok: true,
        msg: 'get API - controlador',
        q , 
        nombre, 
        apikey
    })
};



const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Delete API - controlador'
    })
};

module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosDelete
};

