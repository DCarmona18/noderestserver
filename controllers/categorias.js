const { response } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async(req, res = response) => {
    const{ limite = 5, desde = 0 } = req.query;
    const query = {estado:true};
    const categorias = Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)); 

    const total = Categoria.countDocuments(query);

    // Ejecutar promesas de forma sincrona
    const [categoriasResp, totalResp]  = await Promise.all([categorias, total]);

    res.json({
        totalResp,
        categoriasResp
    })
};

// obtenerCategoria - populate
const obtenerCategoria = async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario','nombre'); 

    if(!categoria){
        res.status(404).json({
            msg: 'Categoria no encontrada'
        });
    }

    res.json({
        categoria
    })
};


const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria(data);

    // Guardar db
    await categoria.save();

    res.status(201).json({categoria});
};

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {
    const { id } = req.params;
    const {_id, estado, usuario, ...body } = req.body;
    
    body.nombre = body.nombre.toUpperCase();
    body.usuario = req.usuario._id;

    /*if(body.nombre !== null) {
        const categoria = Categoria.findOne({nombre: body.nombre});
        if(categoria && categoria._id !== id){
            return res.status(400).json({
                msg: `Ya existe una categoría con nombre ${body.nombre}`
            });
        }
    }*/

    const categoria = await Categoria.findByIdAndUpdate(id, body, {new: true});

    res.json({
        categoria
    })
};
// borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});
    res.json({
        categoria
    })
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
};