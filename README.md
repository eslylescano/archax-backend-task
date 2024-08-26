# Node.js Archax Backend Developer Test

This document contains answers and code solutions for a Node.js Archax backend developer test.

## 1. Why `{ a: 1 } === { a: 1 }` is False in JavaScript

In JavaScript, objects are compared by reference, not by value. Even though two objects may have identical properties and values, they are not considered equal unless they reference the same memory location.

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1 };

console.log(obj1 === obj2); // false
```

## 2. Runtime Difference: `for await` vs. `forEach` with `async/await`

- **`for await ... of` loop**: Handles promises sequentially, waiting for each to resolve before continuing.
- **`forEach` with `async/await`**: Triggers all async operations concurrently but does not properly handle awaiting each operation in sequence.

```javascript
// Sequential execution
for await (const p of [p1, p2, p3]) {
    await p;
}

// Concurrent execution
[p1, p2, p3].forEach(async (p) => {
    await p;
});
```

## 3. Difference Between Node.js and V8

- **Node.js**: A runtime environment that allows JavaScript to run server-side, providing additional APIs and libraries.
- **V8**: The JavaScript engine developed by Google, used to execute JavaScript code by converting it to native machine code.

## 4. TypeScript: Enum vs. Object

- **Enum**: Immutable, type-safe constants.
- **Object**: Mutable collection of key-value pairs.

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

const Direction = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4
};
```

## 5. TypeScript Variable Declaration for Object Key

```typescript
const b = {
    name: "John",
    age: 30,
    job: "Developer"
};

type KeysOfB = keyof typeof b;
let a: KeysOfB;  // a can only be "name", "age", or "job"
```

## 6. Drawbacks of TypeScript in Large Applications

- Complexity in type definitions.
- Longer build times.
- Steep learning curve.
- Inflexibility in dynamic scenarios.
- Compatibility issues with third-party libraries.

## 7. Simple HTTP Server in Node.js Using Only Built-in Modules

### Requirements:
- No use of `HTTP`, `HTTP/2`, or `HTTPS` modules.
- `GET /time` route returns the current time in JSON.
- `GET /data` route returns data after 1 second.
- Uses correct HTTP headers.

It is possible to build an HTTP server by working directly with TCP sockets, which are provided by the net module in Node.js. We can manually handle HTTP requests and responses by parsing the raw data sent over the TCP connection.

### Code test:

```javascript
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

```

### Code implementation:
```javascript
const net = require('net');

function writeResponse(socket, statusCode, headers, body) {
    socket.write(`HTTP/1.1 ${statusCode}\r\n`);
    for (const key in headers) {
        socket.write(`${key}: ${headers[key]}\r\n`);
    }
    socket.write('\r\n');
    socket.write(body);
    socket.end();
}

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const request = data.toString();
        const [method, url] = request.split(' ');

        if (method === 'GET') {
            if (url === '/time') {
                const currentTime = new Date().toISOString();
                writeResponse(socket, '200 OK', { 'Content-Type': 'application/json' }, JSON.stringify({ time: currentTime }));
            } else if (url === '/data') {
                setTimeout(() => {
                    writeResponse(socket, '200 OK', { 'Content-Type': 'application/json' }, JSON.stringify({ data: 'Here is your data' }));
                }, 1000);
            } else {
                writeResponse(socket, '404 Not Found', { 'Content-Type': 'text/plain' }, 'Route not found');
            }
        } else {
            writeResponse(socket, '405 Method Not Allowed', { 'Content-Type': 'text/plain' }, 'Method not allowed');
        }
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

module.exports = server;

if (require.main === module) {
    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
}
```