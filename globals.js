const fs = require('fs');
const path = require('path');

const getModules = (modulesName) => {
    const modulesPath = path.join(process.cwd(), modulesName);
    return fs.readdirSync(modulesPath).reduce((modules, current) => {
        const currentPath = path.join(modulesPath, current);
        modules[current.split('.')[0]] = require(currentPath);
        return modules;
    }, {});
};

const getConfig = () => {
    const configPath = path.join(process.cwd(), '/config/index.json');
    const config = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(config);
};

const getUtil = utilName => {
    const utilPath = path.join(process.cwd(), 'utils', utilName);
    return require(utilPath);
};

const killProcess = exitCode => process.exit(exitCode);

exports.setGlobals = function() {
    global.getConfig = getConfig;
    global.getModules = getModules;
    global.killProcess = killProcess;
    global.getUtil = getUtil;
};