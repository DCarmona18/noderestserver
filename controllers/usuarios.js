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
    const {_id, password, google, correo, ...body } = req.body;

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

const usuariosGet = async (req = request, res = response) => {
    const{ limite = 5, desde = 0 } = req.query;
    const query = {estado:true};
    const usuarios = Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite)); 

    const total = Usuario.countDocuments(query);

    // Ejecutar promesas de forma sincrona
    const [usuariosResp, totalResp]  = await Promise.all([usuarios, total]);

    res.json({
        totalResp,
        usuariosResp
    })
};



const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    res.json({
        usuario
    })
};

module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosDelete
};

