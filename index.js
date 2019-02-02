require('./globals').setGlobals();

const Koa = require('koa');
const app = new Koa();

const config = getConfig();

const fs = require('fs');

const middlewares = fs.readdirSync(process.cwd() + '/middlewares').sort();
middlewares.forEach(middlewarePath => {
    const middleware = require('./middlewares/' + middlewarePath);
    app.use(middleware());
});

const Router = require('koa-router');
const router = new Router({
    prefix: '/api'
});

const routes = Object.values(getModules('routes'));
routes.forEach(route => router[route.method](route.path, route.handler));

app.use(router.routes());

app.listen(config.port, () => console.log(`Server is listening on port: ${config.port}`));