const http = require('http');
const url = require('url');

let users = [
    {
        id: 1,
        name: 'John',
        email: 'john@example.com'
    },
    {
        id: 2,
        name: 'David',
        email: 'david@example.com'
    }
];

const server = http.createServer((req, res) => {

    // JSON response
    res.setHeader('Content-Type', 'application/json');

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // GET /api/users
    if (method === 'GET' && path === '/api/users') {

        return res.end(JSON.stringify({
            status: true,
            data: users
        }));
    }

    // GET /api/users/:id
    if (method === 'GET' && path.startsWith('/api/users/')) {

        const id = parseInt(path.split('/')[3]);

        const user = users.find(user => user.id === id);

        if (!user) {
            res.statusCode = 404;

            return res.end(JSON.stringify({
                status: false,
                message: 'User not found'
            }));
        }

        return res.end(JSON.stringify({
            status: true,
            data: user
        }));
    }

    // POST /api/users
    if (method === 'POST' && path === '/api/users') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const data = JSON.parse(body);

            const newUser = {
                id: users.length + 1,
                name: data.name,
                email: data.email
            };

            users.push(newUser);

            res.statusCode = 201;

            res.end(JSON.stringify({
                status: true,
                message: 'User created successfully',
                data: newUser
            }));
        });

        return;
    }

    // PUT /api/users/:id
    if (method === 'PUT' && path.startsWith('/api/users/')) {

        const id = parseInt(path.split('/')[3]);

        const user = users.find(user => user.id === id);

        if (!user) {
            res.statusCode = 404;

            return res.end(JSON.stringify({
                status: false,
                message: 'User not found'
            }));
        }

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const data = JSON.parse(body);

            user.name = data.name;
            user.email = data.email;

            res.end(JSON.stringify({
                status: true,
                message: 'User updated successfully',
                data: user
            }));
        });

        return;
    }

    // DELETE /api/users/:id
    if (method === 'DELETE' && path.startsWith('/api/users/')) {

        const id = parseInt(path.split('/')[3]);

        const index = users.findIndex(user => user.id === id);

        if (index === -1) {
            res.statusCode = 404;

            return res.end(JSON.stringify({
                status: false,
                message: 'User not found'
            }));
        }

        users.splice(index, 1);

        return res.end(JSON.stringify({
            status: true,
            message: 'User deleted successfully'
        }));
    }

    // Route not found
    res.statusCode = 404;

    res.end(JSON.stringify({
        status: false,
        message: 'Route not found'
    }));
});

server.listen(4500, () => {
    console.log('Server running on http://localhost:4500');
});