const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const {response} = require("express");
const {uploadFile} = require("../helpers");
const {User, Product} = require('../models');

const uploadFiles = async (req, res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'img');
        res.json({name});
    } catch (err) {
        res.status(400).json({err});
    }
}

const updateImg = async (req, res = response) => {
    const {id, collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
    }

    model.img = await uploadFile(req.files, undefined, collection);

    await model.save();

    res.json(model)
}

const showImg = async (req, res) => {
    const {id, collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) return res.sendFile(pathImg);
    }

    const pathPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathPlaceHolder);
}

// Cloudinary
const updateImgCloudinary = async (req, res = response) => {
    const {id, collection} = req.params;

    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas
    if (model.img) {
        // Borrar imagen de cloudinary
        const nameArray = model.img.split('/');
        const name = nameArray[nameArray.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(`${collection}/${public_id}`);
    }

    // Extraer el path temporal
    const {tempFilePath} = req.files.file;

    const {secure_url} = await cloudinary.uploader.upload(tempFilePath, {folder: collection});

    model.img = secure_url;

    await model.save();

    res.json(model);
}

module.exports = {
    uploadFiles,
    updateImg,
    showImg,
    updateImgCloudinary
}