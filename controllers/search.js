const {response} = require("express");
const {ObjectId} = require('mongoose').Types;

const {User, Category, Product} = require('../models')

const collectionsAllowed = [
    'users',
    'categories',
    'products',
    'productsByCategory',
    'roles'
];

const searchUsers = async (term, res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regexp = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{name: regexp}, {email: regexp}],
        $and: [{state: true}]
    });

    res.json({
        results: users
    })
}

const searchCategories = async (term, res = response) => {
    const idMongoId = ObjectId.isValid(term);
    if (idMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regexp = new RegExp(term, 'i');
    const category = await Category.find({name: regexp, state: true});

    res.json({
        results: category
    })
}

const searchProducts = async (term, res = response) => {
    const idMongoId = ObjectId.isValid(term);
    if (idMongoId) {
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regexp = new RegExp(term, 'i');
    const product = await Product.find({name: regexp, state: true}).populate('category', 'name');

    res.json({
        results: product
    })
}

const searchProductsByCategory = async (term, res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.find({category: ObjectId(term), state: true}).populate('category', 'name');
        return res.json({
            results: product
        })
    }

    const regexp = new RegExp(term, 'i');

    // Busca una categoría por name
    const category = await Category.findOne({name: regexp, state: true})

    // Valida si existe una categoría por name
    if (!category) return res.status(400).json({
        msg: `No existe la categoría ${term}`
    })

    // Busca los productos que coincidan con la categoría
    const products = await Product.find({category: category._id}).populate('category', 'name')

    res.json({
        results: products
    })
}

const search = (req, res = response) => {
    const {collection, term} = req.params;

    if (!collectionsAllowed.includes(collection)) res.status(400).json({
        msg: `Las colecciones permitidas son: ${collectionsAllowed}`
    });

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'productsByCategory':
            searchProductsByCategory(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta busquedá'
            });
    }

}

module.exports = {
    search
}