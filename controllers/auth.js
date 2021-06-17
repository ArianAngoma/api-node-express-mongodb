const bcryptjs = require('bcryptjs');
const {response} = require('express');
const User = require('../models/user');
const {generateJWT} = require('../helpers/generate-jwt')
const {googleVerify} = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const {email, password} = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo'
        });

        // Verificar si el usuario está activo
        if (!user.state) return res.status(400).json({
            msg: 'Usuario / Password no son correctos - estado: false'
        });

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json({
            msg: 'Usuario / Password no son correctos - password'
        });

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;
    try {
        const {email, name, img} = await googleVerify(id_token);
        let user = await User.findOne({email});
        if (!user) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };
            user = new User(data);
            await user.save();
        }

        // Si el usuario en DB
        if (!user.state) return res.status(400).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });

        // Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (err) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}