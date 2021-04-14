const { Router } = require("express");
const { checkSchema } = require("express-validator");
const { validateTransaction, transactionSchema, similaritiesSchema } = require("../validations");
const { getOne, getAll, deleteOne, createOne, updateOne, getSimilarUsers } = require('./transactions.controller');

const transactionRoutes = Router()

transactionRoutes.route('/')
    .get(getAll)
    .post(checkSchema(transactionSchema), createOne)

transactionRoutes.route('/similar/:id')
    .post(checkSchema(similaritiesSchema), getSimilarUsers)

transactionRoutes.route('/:id')
    .get(getOne)
    .delete(deleteOne)
    .patch(updateOne)

module.exports = transactionRoutes