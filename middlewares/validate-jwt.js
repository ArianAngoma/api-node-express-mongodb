const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) return res.status(401).json({
        msg: 'No hay token en la petición'
    });

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        // Leer usuario que corresponde al uid
        const user = await User.findById(uid);
        if (!user) return res.status(401).json({
            msg: 'Token no válido - usuario no existe en DB'
        });

        // Verificar si el uid tiene state true
        if (!user.state) return res.status(401).json({
            msg: 'Token no válido - usuario con state false'
        });

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validateJWT
}