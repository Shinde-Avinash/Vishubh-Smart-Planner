const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    try {
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                username: 'testapiuser2',
                email: 'testapi2@example.com',
                password: 'password123'
            });
            token = res.data.token;
        } catch (e) {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'testapi2@example.com',
                password: 'password123'
            });
            token = res.data.token;
        }

        const headers = { Authorization: `Bearer ${token}` };

        try {
            const scheduleRes = await axios.post(`${API_URL}/ai/schedule`, {}, { headers });
            console.log('SCHEDULE STATUS:', scheduleRes.status);
        } catch (e) {
            console.log('SCHEDULE FAILED:', e.response ? e.response.status : e.message);
            if (e.response && e.response.data) {
                console.log('ERROR DATA:', JSON.stringify(e.response.data).substring(0, 100));
            }
        }

    } catch (error) {
        console.log('SETUP FAILED:', error.message);
    }
}

testEndpoints();
