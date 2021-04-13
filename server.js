const dotEnv = require('dotenv');
dotEnv.config();
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authmiddleWare = require('./src/middleware');
const { InitConnection } = require('./src/db');
const transactionRoutes = require('./src/resources/transactions.route');
const { response } = require('./src/utils');


app.use(bodyParser.json())

// express.urlencoded({ extended: true })

const baseapi  =  '/api/v1/';

app.use(morgan('dev'));

app.use(baseapi + 'transactions', authmiddleWare, transactionRoutes)

app.use('*' , (_, res) => {
    return response(res, 404, false , null, 'not found')
})

const port = process.env.PORT || 3000

app.listen(port , async () => {
    await InitConnection()
    console.log();
})

module.exports = app;