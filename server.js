const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authmiddleWare = require('./src/middleware');
const transactionRoutes = require('./src/resources/transactions.route');
const { response } = require('./src/utils');


app.use(bodyParser.json())

const baseapi  =  '/api/v1/';

app.use(morgan('dev'));

app.use(baseapi + 'transactions', authmiddleWare, transactionRoutes)

app.use('*' , (_, res) => {
    return response(res, 404, false , null, 'not found')
})

module.exports = app;