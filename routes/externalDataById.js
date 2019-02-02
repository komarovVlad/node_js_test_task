const handler = async ctx => {
    const result = await ctx.getController('externalData').fetchFakeData(ctx.params.id);
    ctx.response.body = JSON.stringify(result);
};

module.exports = {
    method: 'get',
    path: '/todos/:id*',
    handler
};