const errorHandler = async (ctx, next) => {
    try{
        await next();
    }catch(e){
        if (e.status) {
            ctx.body = e.message;
            ctx.status = e.status;
        } else {
            ctx.body = 'Internal server error';
            ctx.status = 500;
            console.error(e);
        }
    }
};

module.exports = () => errorHandler;