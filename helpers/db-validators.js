const {Role, User, Category, Product} = require('../models')

// roles => Valida si role esta registrado en la DB
const isValidRole = async (role = '') => {
    const existsRole = await Role.findOne({role});
    if (!existsRole) throw new Error(`El rol ${role} no está registrado en la DB`);
}

// users => Valida si email ya esta registrado en la DB
const emailExists = async (email = '') => {
    const existsEmail = await User.findOne({email});
    if (existsEmail) throw new Error(`El correo ${email} ya esta registrado`);
}

// users => Valida si id de usuario existe en la DB
const userExistsById = async (id) => {
    const existsUser = await User.findById(id);
    if (!existsUser) throw new Error(`El id ${id} no existe`);
}

// users - jwt => Valida si token de req.user (JWT) es la misma que el id del usuario
const isIdUserToken = async (id, {req}) => {
    const idToken = req.user.id;
    if (id !== idToken) throw new Error(`No puedes actualizar al usuario con id ${id} - token diferente`);
}

// categories => Valida si existe una categoria por id en la DB
const categoryExistsById = async (id) => {
    const categoryExists = await Category.findById(id);
    if (!categoryExists) throw new Error(`La categoría con el ${id} no existe`);
}

// categories => Valida si state de la categoria es true
const isStateCategoryTrue = async (id) => {
    const {state} = await Category.findById(id);
    if (!state) throw new Error(`La categoría con el id ${id} no existe - state: false`)
}

// categories => Valida si existe una categoría por name en la DB
const existsCategoryByName = async (name, {req}) => {
    const categoryExists = await Category.findOne({name: name.toUpperCase()});
    if ((categoryExists) && (categoryExists.id !== req.params.id)) throw new Error(`La categoría ${name} ya existe`);
}

// products => Valida si existe un producto por id en la DB
const productExistsById = async (id) => {
    const productExists = await Product.findById(id);
    if (!productExists) throw new Error(`El producto con el ${id} no existe`);
}

// products => Valida si es state del producto es true
const isStateProductTrue = async (id) => {
    const {state} = await Product.findById(id);
    if (!state) throw new Error(`El producto con el id ${id} no existe - state: false`)
}

// product => Valida si existe un producto por name en la DB
const existsProductByName = async (name, {req}) => {
    const productExists = await Product.findOne({name: name.toUpperCase()});
    if ((productExists) && (productExists.id !== req.params.id)) throw new Error(`El producto ${name} ya existe`);
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    isIdUserToken,
    categoryExistsById,
    isStateCategoryTrue,
    existsCategoryByName,
    productExistsById,
    isStateProductTrue,
    existsProductByName
}