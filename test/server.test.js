const net = require('net');
const server = require('../server');

describe('Simple HTTP Server', function () {
    let client;
    const port = 3001;

    beforeAll((done) => {
        server.listen(port, () => {
            console.log(`Test server listening on port ${port}`);
            done();
        });
    });

    afterAll((done) => {
        server.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    beforeEach(() => {
        client = new net.Socket();
    });

    afterEach(() => {
        client.destroy();
    });

    function sendRequest(request, callback) {
        client.connect(port, '127.0.0.1', () => {
            client.write(request);
        });

        client.on('data', (data) => {
            callback(data.toString());
            client.destroy();
        });
    }

    test('should return current time in JSON for GET /time', (done) => {
        const request = 'GET /time HTTP/1.1\r\nHost: localhost\r\n\r\n';

        sendRequest(request, (response) => {
            expect(response).toContain('HTTP/1.1 200 OK');
            expect(response).toContain('Content-Type: application/json');

            const body = response.split('\r\n\r\n')[1];
            const jsonResponse = JSON.parse(body);
            expect(jsonResponse).toHaveProperty('time');
            expect(new Date(jsonResponse.time).toString()).not.toBe('Invalid Date');

            done();
        });
    });

    test('should return data after 1 second for GET /data', (done) => {
        jest.setTimeout(3000);

        const request = 'GET /data HTTP/1.1\r\nHost: localhost\r\n\r\n';

        const startTime = new Date().getTime();

        sendRequest(request, (response) => {
            const elapsedTime = new Date().getTime() - startTime;

            expect(response).toContain('HTTP/1.1 200 OK');
            expect(response).toContain('Content-Type: application/json');

            const body = response.split('\r\n\r\n')[1];
            const jsonResponse = JSON.parse(body);
            expect(jsonResponse).toHaveProperty('data', 'Here is your data');

            expect(elapsedTime).toBeGreaterThan(1000);

            done();
        });
    });

    test('should return 404 for unknown routes', (done) => {
        const request = 'GET /unknown HTTP/1.1\r\nHost: localhost\r\n\r\n';

        sendRequest(request, (response) => {
            expect(response).toContain('HTTP/1.1 404 Not Found');
            expect(response).toContain('Content-Type: text/plain');
            expect(response).toContain('Route not found');

            done();
        });
    });

    test('should return 405 for non-GET requests', (done) => {
        const request = 'POST /time HTTP/1.1\r\nHost: localhost\r\n\r\n';

        sendRequest(request, (response) => {
            expect(response).toContain('HTTP/1.1 405 Method Not Allowed');
            expect(response).toContain('Content-Type: text/plain');
            expect(response).toContain('Method not allowed');

            done();
        });
    });
});
