const https = require('https');
const http = require('http');

const ENCODING = 'utf8';
const API_ERROR_MESSAGE = 'API_ERROR';
const JSON_ERROR_MESSAGE = 'CORRUPTED_JSON';
const DEFAULT_TIMEOUT = 30 * 1000;
const DEFAULT_CONTENT_TYPE = "application/json";
const getDefaultPort = requestType => requestType === 'https' ? 443 : 80;

const createError =  (body, res, options, data, error)  => {
    body.statusCode = res.statusCode;
    body.options = options;
    body.data = data;
    body.error = body.error || error;

    return body;
};

const createRequest = requestType => (httpOptions, data) => new Promise((resolve, reject) => {
    const requestModule = requestType === 'https' ? https : http;
    const defaultHttpOptions = {
        port: getDefaultPort(requestType),
        timeout: DEFAULT_TIMEOUT,
        headers: {
            "Content-Type": DEFAULT_CONTENT_TYPE
        }
    };
    const options = {
        ...defaultHttpOptions,
        ...httpOptions,
        headers: {
            ...defaultHttpOptions.headers,
            ...httpOptions.headers
        }
    };
    const request = requestModule.request(options, res => {
        let response = {};
        let bodyString = '';
        let body;

        res.setEncoding(ENCODING);
        res.on('data', chunk => bodyString += chunk);
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

module.exports = createRequest;