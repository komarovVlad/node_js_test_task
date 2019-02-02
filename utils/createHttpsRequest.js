const https = require('https');

const ENCODING = 'utf8';
const API_ERROR_MESSAGE = 'API_ERROR';
const JSON_ERROR_MESSAGE = 'CORRUPTED_JSON';
const DEFAULT_TIMEOUT = 30 * 1000;
const DEFAULT_PORT = 443;
const DEFAULT_CONTENT_TYPE = "application/json";

const defaultHttpOptions = {
    port: DEFAULT_PORT,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        "Content-Type": DEFAULT_CONTENT_TYPE
    }
};

const createError =  (body, res, options, data, error)  => {
    body.statusCode = res.statusCode;
    body.options = options;
    body.data = data;
    body.error = body.error || error;

    return body;
};

const createHttpsRequest = (httpOptions, data) => new Promise((resolve, reject) => {
    const options = {
        ...defaultHttpOptions,
        ...httpOptions,
        headers: {
            ...defaultHttpOptions.headers,
            ...httpOptions.headers
        }
    };
    const request = https.request(options, res => {
        let response = {};
        let bodyString = '';
        let body;

        res.setEncoding(ENCODING);
        res.on('data', chunk => {
            bodyString += chunk;
        });
        res.on('end', () => {
            bodyString = bodyString || '{}';
            try {
                body = JSON.parse(bodyString);
            } catch (error) {
                body = createError({}, res, options, data, JSON_ERROR_MESSAGE);
            }

            response = {
                headers: res.headers,
                statusCode: res.statusCode,
                body: body
            };

            return body && body.error ? reject(response) : resolve(response);
        });
    })
        .on('error', error => {
            reject({
                error: API_ERROR_MESSAGE,
                body: error,
                options: options
            });
        });

    if (httpOptions.timeout) {
        request.setTimeout(httpOptions.timeout, () => {
            request.end(reject('Timeout request'));
        });
    }

    if (data) {
        request.write(JSON.stringify(data));
    }

    request.end();
});

module.exports = createHttpsRequest;