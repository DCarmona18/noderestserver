const {response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;
    try {

        // Verificar si email existe
        const usuario = await Usuario.findOne({correo, status:true});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }
        // Si el usuario está activo en base de datos

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Ok',
            correo, password, token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    login
};

