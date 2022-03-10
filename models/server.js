const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { auth } = require('google-auth-library');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar'
        };

        // Connect db
        this.connectDB();

        // Middleware
        this.middlewares();

        // Rutas de mi applicación
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Public directory
        this.app.use( express.static('public'));
    }

    routes(){
        this.app.use(this.paths.usuarios,   require('../routes/usuarios'));
        this.app.use(this.paths.auth,       require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos,  require('../routes/productos'));
        this.app.use(this.paths.buscar,     require('../routes/buscar'));
    }

    listen(){
        this.app.listen(this.port, () => {console.log('Servidor coriendo en puerto: ', this.port)})
    }
}

module.exports = Server;