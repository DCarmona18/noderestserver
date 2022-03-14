const {response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

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
            correo, password, token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;
    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            // Crear usuario
            const data = {
                nombre,
                correo,
                password: 'GOOGLEAUTH',
                img,
                google: true,
                role: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        } else{
            // actualizar usuario

            if(!usuario.status){
                res.status(401).json({
                    msg: 'Hablke con el administrador - usuario bloqueado'
                });
            }
        }


        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        });
    }
    
};

const renovarToken = async(req, res = response) => {
    const { usuario } = req;
    // Generar JWT
    const token = await generarJWT(usuario.id);
    
    res.json({usuario, token});
};

module.exports = {
    login,
    googleSignIn,
    renovarToken
};

