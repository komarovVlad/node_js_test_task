const controllers = getModules('controllers');

const init = async (ctx, next) => {
    ctx.getController = controllerName => {
        const controller = controllers[controllerName];
        return {
            ...controller,
            ctx,
            next
        };
    };
    await next();
};

module.exports = () => init;