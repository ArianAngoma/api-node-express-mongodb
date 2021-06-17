const {response} = require('express');
const {Product} = require('../models');

const getProducts = async (req, res = response) => {
    const {limit = 5, from = 0} = req.query;
    const query = {state: true};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query).populate('user', 'name').populate('category', 'name').skip(Number(from)).limit(Number(limit))
    ])

    res.json({
        total,
        products
    })
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');
    res.json(product);
}

const createProduct = async (req, res = response) => {
    const {state, user, ...body} = req.body;
    const name = body.name.toUpperCase();

    // Generar la data a guardar
    const data = {
        ...body,
        name,
        user: req.user._id
    }

    const product = new Product(data);

    // Guardar DB
    await product.save();

    res.json(product);
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {state, user, ...data} = req.body;
    if (data.name) data.name = data.name.toUpperCase();
    data.user = req.user._id;
    const product = await Product.findByIdAndUpdate(id, data, {new: true});
    res.json(product);
}

const deleteProduct = async (req, res) => {
    const {id} = req.params;

    const product = await Product.findByIdAndUpdate(id, {state: false}, {new: true});
    res.json(product);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}