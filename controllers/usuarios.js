const {response, request } = require('express');

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'post API - controlador',
        nombre,
        edad
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

const usuariosPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        ok: true,
        msg: 'Put API - controlador',
        id
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

