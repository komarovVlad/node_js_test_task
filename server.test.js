require('./globals').setGlobals();
const childProcess = require('child_process');
const config = getConfig();
const createHttpRequest = getUtil('createRequest')();
const assert = require('assert');

let server;
const processServer = () => new Promise(resolve => {
    server = childProcess.spawn('node', ['index.js']);
    server.stdout.on('data', resolve);
});


describe('API Server', () => {
    before(() => processServer());
    after(done => {
        server.kill();
        done();
    });
    describe('POST /api/data', () => {
        after(() => processServer());
        it('Should return extended payload with random field "a" in range 1...6', async () => {
            const minRandomValue = 1;
            const maxRandomValue = 6;
            const expectedStatusCode = 200;
            const payload = {x: 1};
            const httpOptions = {
                method: "POST",
                hostname: "127.0.0.1",
                port: config.port,
                path: '/api/data'
            };
            const response = await createHttpRequest(httpOptions, payload);
            assert.strictEqual(response.statusCode ,expectedStatusCode);
            const randomVariable = response.body.a;
            delete response.body.a;
            assert.deepStrictEqual(response.body, payload);
            assert.ok(randomVariable >= minRandomValue && randomVariable < maxRandomValue);
        });

        it('Should kill process with exit code "2" after respond to client, if payload contains "command": "shutdown"', async () => {
            const minRandomValue = 1;
            const maxRandomValue = 6;
            const expectedStatusCode = 200;
            const payload = {x: 1, "command": "shutdown"};
            const expectedShutdownSignal = 2;
            const httpOptions = {
                method: "POST",
                hostname: "127.0.0.1",
                port: config.port,
                path: '/api/data'
            };
            const response = await createHttpRequest(httpOptions, payload);
            assert.strictEqual(response.statusCode, expectedStatusCode);
            const randomVariable = response.body.a;
            delete response.body.a;
            assert.deepStrictEqual(response.body, payload);
            assert.ok(randomVariable >= minRandomValue && randomVariable < maxRandomValue);
            return new Promise(resolve => {
                server.on('close', signal => {
                    assert.strictEqual(signal, expectedShutdownSignal);
                    resolve();
                })
            }).then(() => server.removeAllListeners());
        });
    });

    describe('GET /api/todos/:id*', () => {
        it('Should return single todo with specified id in path from "jsonplaceholder" service', async () => {
            const expectedStatusCode = 200;
            const specifiedId = 1;
            const serverHttpOptions = {
                method: "GET",
                hostname: "127.0.0.1",
                port: config.port,
                path: '/api/todos/' + specifiedId
            };
            const serviceHttpOptions = {
                method: "GET",
                hostname: "jsonplaceholder.typicode.com",
                path: '/todos/' + specifiedId
            };
            const [serverResponse, serviceResponse] = await Promise.all([
                createHttpRequest(serverHttpOptions),
                createHttpRequest(serviceHttpOptions)
            ]);
            assert.strictEqual(serverResponse.statusCode, expectedStatusCode);
            assert.deepStrictEqual(serverResponse.body, serviceResponse.body);
        });
        it('Should return all existing todos from "jsonplaceholder" service', async () => {
            const expectedStatusCode = 200;
            const serverHttpOptions = {
                method: "GET",
                hostname: "127.0.0.1",
                port: config.port,
                path: '/api/todos'
            };
            const serviceHttpOptions = {
                method: "GET",
                hostname: "jsonplaceholder.typicode.com",
                path: '/todos'
            };
            const [serverResponse, serviceResponse] = await Promise.all([
                createHttpRequest(serverHttpOptions),
                createHttpRequest(serviceHttpOptions)
            ]);
            assert.strictEqual(serverResponse.statusCode, expectedStatusCode);
            assert.strictEqual(serviceResponse.statusCode, expectedStatusCode);
            assert.deepStrictEqual(serverResponse.body, serviceResponse.body);
        })
    });

    describe('404 - Not Found', () => {
        it('Should return 404 if route is not found', () => {
            const expectedStatusCode = 404;
            const httpOptions = {
                method: "GET",
                hostname: "127.0.0.1",
                port: config.port,
                path: '/api/lala'
            };
            return createHttpRequest(httpOptions)
                .catch(response => {
                    assert.strictEqual(response.statusCode, expectedStatusCode);
                })
        })
    })
});