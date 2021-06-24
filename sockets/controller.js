const {Socket} = require("socket.io");
const {checkJWT} = require("../helpers");

const {Message} = require('../models');

let usersOnline = {};

// socket = new Socket() -> no se debe de hacer, solo para desarrollar en js
const socketController = async (socket = new Socket(), io) => {
    // Verificar token
    const user = await checkJWT(socket.handshake.headers['x-token']);
    if (!user) return socket.disconnect();

    // Agregar al usuario conectado
    usersOnline[user.id] = user;

    io.emit('active-users', Object.values(usersOnline));

    // Emitir mensaje solo al usuario conectado
    socket.emit('receive-msg', await Message.find().populate('user', 'name'));

    // Conectar al cliente a una sala especial
    socket.join(user.id);

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        delete usersOnline[user.id];
        //chatMessage.disconnectUser(user.id);
        io.emit('active-users', Object.values(usersOnline));
    });

    // Recive el mensaje
    socket.on('send-msg', async ({uid, msg}) => {
        const data = {
            message: msg,
            user: user.id
        }

        const message = new Message(data);
        await message.save();

        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('msg-private', {from: user.name, msg});
        } else {
            // Emitir mensaje a todos
            io.emit('receive-msg', await Message.find().populate('user', 'name'));
        }
    })
}

module.exports = {
    socketController
}