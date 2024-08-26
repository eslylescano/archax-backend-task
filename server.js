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
