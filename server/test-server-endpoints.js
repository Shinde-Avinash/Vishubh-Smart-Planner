const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    try {
        console.log('1. Registering/Logging in...');
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                username: 'testapiuser',
                email: 'testapi@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('Registered successfully.');
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('User already exists, logging in...');
                const res = await axios.post(`${API_URL}/auth/login`, {
                    email: 'testapi@example.com',
                    password: 'password123'
                });
                token = res.data.token;
                console.log('Logged in successfully.');
            } else {
                throw e;
            }
        }

        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n2. Testing Chat Endpoint...');
        try {
            const chatRes = await axios.post(`${API_URL}/ai/chat`, {
                message: 'Hello',
                context: null
            }, { headers });
            console.log('Chat Response Status:', chatRes.status);
            console.log('Chat Response Data:', JSON.stringify(chatRes.data, null, 2));
        } catch (e) {
            console.error('Chat Endpoint Failed:', e.response ? e.response.data : e.message);
        }

        console.log('\n3. Testing Schedule Endpoint...');
        try {
            const scheduleRes = await axios.post(`${API_URL}/ai/schedule`, {}, { headers });
            console.log('Schedule Response Status:', scheduleRes.status);
            console.log('Schedule Response Data:', JSON.stringify(scheduleRes.data, null, 2));
        } catch (e) {
            console.error('Schedule Endpoint Failed:', e.response ? e.response.data : e.message);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testEndpoints();
