const http = require('http');

const timestamp = Date.now();
const registerData = JSON.stringify({
    username: `TestUser_${timestamp}`,
    email: `test_ai_${timestamp}@example.com`,
    password: 'password123'
});

const loginData = JSON.stringify({
    email: `test_ai_${timestamp}@example.com`,
    password: 'password123'
});

function makeRequest(path, method, data, token = null, callback) {
    const options = {
        hostname: 'localhost',
        port: 5001,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => callback(res.statusCode, body));
    });

    req.on('error', (e) => console.error(`Request error: ${e.message}`));
    req.write(data);
    req.end();
}

console.log('1. Registering user...');
makeRequest('/api/auth/register', 'POST', registerData, null, (status, body) => {
    console.log(`Register Status: ${status}`);
    console.log(`Register Body: ${body}`);

    console.log('\n2. Logging in...');
    makeRequest('/api/auth/login', 'POST', loginData, null, (status, body) => {
        console.log(`Login Status: ${status}`);
        const response = JSON.parse(body);

        if (response.token) {
            console.log('\n3. Testing AI Chat...');
            const chatData = JSON.stringify({
                message: "Hello, are you working?",
                context: "general"
            });

            makeRequest('/api/ai/chat', 'POST', chatData, response.token, (status, body) => {
                console.log(`AI Chat Status: ${status}`);
                console.log(`AI Chat Body: ${body}`);
            });
        } else {
            console.error('Login failed, cannot test AI chat');
        }
    });
});
