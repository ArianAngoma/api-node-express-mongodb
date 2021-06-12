const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;
    const query = {state: true};

    // Este código es bloqueante porque espera la respuesta de una para seguir
    /*const users = await User.find(query)
        .skip(Number(from))
        .limit(Number(limit));
    const total = await User.countDocuments(query);*/

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const usersPost = async (req, res = response) => {
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en DB
    await user.save();

    res.json(user);
}

const usersPut = async (req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, ...info} = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        info.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, info, {new: true});
    res.json(user);
}

const usersDelete = async (req, res) => {
    const {id} = req.params;

    // Físicamente borrado
    /*const user = await User.findByIdAndDelete(id);*/

    const user = await User.findByIdAndUpdate(id, {state: false}, {new: true});
    res.json(user);
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}