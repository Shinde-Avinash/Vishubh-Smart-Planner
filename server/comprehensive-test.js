const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('Waiting 3s for server...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('--- STARTING COMPREHENSIVE TEST ---');
    try {
        let token;
        // 1. Auth
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                username: 'testapiuser3',
                email: 'testapi3@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('AUTH: Registered');
        } catch (e) {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'testapi3@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('AUTH: Logged in');
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Tasks
        try {
            await axios.post(`${API_URL}/tasks`, { title: 'Test Task', priority: 'High', category: 'Work' }, { headers });
            const tasksRes = await axios.get(`${API_URL}/tasks`, { headers });
            console.log('TASKS:', tasksRes.status, 'Count:', tasksRes.data.length);
        } catch (e) {
            console.log('TASKS FAILED:', e.message);
        }

        // 3. Moods
        try {
            await axios.post(`${API_URL}/moods`, { mood_score: 8, stress_level: 2, motivation_level: 9, note: 'Good' }, { headers });
            const moodsRes = await axios.get(`${API_URL}/moods`, { headers });
            console.log('MOODS:', moodsRes.status, 'Count:', moodsRes.data.length);
        } catch (e) {
            console.log('MOODS FAILED:', e.message);
        }

        // 4. AI Schedule
        try {
            const scheduleRes = await axios.post(`${API_URL}/ai/schedule`, {}, { headers });
            console.log('SCHEDULE:', scheduleRes.status);
            if (scheduleRes.data.schedule) console.log('SCHEDULE DATA PRESENT');
        } catch (e) {
            console.log('SCHEDULE FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

        // 5. AI Chat
        try {
            const chatRes = await axios.post(`${API_URL}/ai/chat`, { message: 'Hello' }, { headers });
            console.log('CHAT:', chatRes.status);
            console.log('CHAT REPLY:', chatRes.data.reply);
        } catch (e) {
            console.log('CHAT FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

    } catch (error) {
        console.log('FATAL ERROR:', error.message);
        console.log('CODE:', error.code);
        if (error.response) {
            console.log('STATUS:', error.response.status);
            console.log('DATA:', JSON.stringify(error.response.data));
        } else {
            console.log('STACK:', error.stack);
        }
    }
    console.log('--- END TEST ---');
}

testEndpoints();
