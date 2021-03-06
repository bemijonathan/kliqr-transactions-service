const dotEnv = require('dotenv');
dotEnv.config();

const app = require('./server');
const { InitConnection } = require('./src/db');
const port = process.env.PORT || 5000

app.listen(port, async () => {
    await InitConnection()
    console.log('app started on POrt ', port);
})