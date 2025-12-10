const app = require('./src/app');
const config = require('./src/config/app.config');

app.listen(config.port, () => {
    console.log(`${config.appName} is running on port ${config.port}`);
});