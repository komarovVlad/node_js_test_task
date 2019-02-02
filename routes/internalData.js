const handler = ctx => {
    const result = ctx.getController('internalData').setRandomVariable();
    ctx.response.body = JSON.stringify(result);

    const requestBody = ctx.request.body || {};
    if(requestBody.command === 'shutdown'){
        setTimeout(() => global.killProcess(2), 0);
    }
};

module.exports = {
    method: 'post',
    path: '/data',
    handler
};