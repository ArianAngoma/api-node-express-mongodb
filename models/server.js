const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');
const {dbConnection} = require("../database/config");
const {socketController} = require("../sockets/controller");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        /*this.authRouterPath = '/api/auth';
        this.usersRouterPath = '/api/users';*/
        this.path = {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        // Conección a la base de datos
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de la app
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.users, require('../routes/users'));
        this.app.use(this.path.categories, require('../routes/categories'));
        this.app.use(this.path.products, require('../routes/products'));
        this.app.use(this.path.search, require('../routes/search'));
        this.app.use(this.path.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen() {
        // socket
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}`)
        })

        // express
        /*this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}`)
        })*/
    }
}

module.exports = Server;