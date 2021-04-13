const { Router } = require("express");
const { checkSchema } = require("express-validator");
const { validateTransaction, transactionSchema } = require("../validations");
const { getOne, getAll, deleteOne, createOne, updateOne } = require('./transactions.controller');

const transactionRoutes = Router()

transactionRoutes.route('/')
    .get(getAll)
    .post(checkSchema(transactionSchema), createOne)

transactionRoutes.route('/:id')
    .get(getOne)
    .delete(deleteOne)
    .patch(updateOne)

module.exports = transactionRoutes