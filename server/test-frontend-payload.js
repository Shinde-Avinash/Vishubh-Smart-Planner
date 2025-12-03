const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testFrontendPayload() {
    console.log('--- STARTING FRONTEND PAYLOAD TEST ---');
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
            console.log('Login failed (maybe user needs register):', e.message);
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Task Payload (Exact match from Tasks.jsx)
        try {
            console.log('Testing Task Payload...');
            const taskPayload = { title: 'Frontend Task', status: 'Pending' };
            const taskRes = await axios.post(`${API_URL}/tasks`, taskPayload, { headers });
            console.log('TASK CREATED:', taskRes.status, taskRes.data.title);
        } catch (e) {
            console.log('TASK FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

        // 2. Mood Payload (Approximate match from MoodTracker.jsx)
        try {
            console.log('Testing Mood Payload...');
            // MoodTracker sends these as values from state. Assuming integers.
            const moodPayload = {
                mood_score: 8,
                stress_level: 2,
                motivation_level: 9,
                note: 'Frontend Note'
            };
            const moodRes = await axios.post(`${API_URL}/moods`, moodPayload, { headers });
            console.log('MOOD LOGGED:', moodRes.status, moodRes.data.mood_score);
        } catch (e) {
            console.log('MOOD FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

    } catch (error) {
        console.log('FATAL ERROR:', error.message);
    }
    console.log('--- END TEST ---');
}

testFrontendPayload();
