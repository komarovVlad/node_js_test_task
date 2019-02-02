const path = require('path');
const createHttpsRequest = getUtil('createHttpsRequest');

const fetchFakeData = id => {
    let fakePath = "/todos";
    if(id !== undefined) {
        fakePath = path.join(fakePath, id);
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