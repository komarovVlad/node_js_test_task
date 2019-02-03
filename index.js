require('./globals').setGlobals();

const Koa = require('koa');
const app = new Koa();

const fs = require('fs');
const path = require('path');
const config = getConfig();

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
middlewares.forEach(middlewarePath => {
    const middleware = require(path.join(__dirname, 'middlewares', middlewarePath));
    app.use(middleware());
});

const Router = require('koa-router');
const router = new Router({
    prefix: '/api'
});

const routes = Object.values(getModules('routes'));
routes.forEach(route => router[route.method](route.path, route.handler));

app.use(router.routes());

if(!module.parent){
    app.listen(config.port, () => logMessage(`Server is listening on port: ${config.port}`));
}
module.exports = app;