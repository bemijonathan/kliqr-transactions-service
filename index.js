const dotEnv = require('dotenv');
dotEnv.config();

const port = process.env.PORT || 3000

app.listen(port , async () => {
    await InitConnection()
    console.log();
})