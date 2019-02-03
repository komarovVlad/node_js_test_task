const fs = require('fs');
const path = require('path');

const getModules = (modulesName) => {
    const modulesPath = path.join(__dirname, modulesName);
    return fs.readdirSync(modulesPath).reduce((modules, current) => {
        const currentPath = path.join(modulesPath, current);
        modules[current.split('.')[0]] = require(currentPath);
        return modules;
    }, {});
};

const getConfig = () => {
    const configPath = path.join(__dirname, 'config/index.json');
    const config = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(config);
};

const getUtil = utilName => {
    const utilPath = path.join(__dirname, 'utils', utilName);
    return require(utilPath);
};

const killProcess = exitCode => process.exit(exitCode);

const logMessage = message => {
    if(process.env.NODE_ENV !== 'test') {
        console.log(message);
    }
};

exports.setGlobals = function() {
    global.getConfig = getConfig;
    global.getModules = getModules;
    global.killProcess = killProcess;
    global.getUtil = getUtil;
    global.logMessage = logMessage;
};