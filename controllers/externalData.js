const createHttpsRequest = getUtil('createHttpsRequest');

const fetchFakeData = function() {
    const { id } = this.ctx.params;
    let fakePath = "/todos";
    if(id !== undefined) {
        fakePath = fakePath + '/' +id;
    }
    const options = {
        hostname: 'jsonplaceholder.typicode.com',
        path: fakePath,
        method: 'GET'
    };
    return createHttpsRequest(options)
        .then(response => response.body);
};

module.exports = {
    fetchFakeData
};