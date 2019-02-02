const logger = async (ctx, next) => {
    const startTime = Date.now();
    console.log(`<---- ${ctx.request.method.toUpperCase()} ${ctx.request.path}`);
    await next();
    const requestTime = Date.now() - startTime;
    console.log(`----> ${ctx.request.method.toUpperCase()} ${ctx.request.path} ${ctx.response.status} ${requestTime}ms`);
};

module.exports = () => logger;
