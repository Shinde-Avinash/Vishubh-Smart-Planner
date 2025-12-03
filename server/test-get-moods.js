const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testGetMoods() {
    console.log('--- STARTING GET MOODS TEST ---');
    try {
        let token;
        // Login
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'crud@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('AUTH: Logged in');
        } catch (e) {
            console.log('Login failed:', e.message);
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Get Moods
        try {
            console.log('Getting Moods...');
            const moodRes = await axios.get(`${API_URL}/moods`, { headers });
            console.log('MOODS:', moodRes.status, 'Count:', moodRes.data.length);
        } catch (e) {
            console.log('MOODS FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

    } catch (error) {
        console.log('FATAL ERROR:', error.message);
    }
    console.log('--- END TEST ---');
}

testGetMoods();
