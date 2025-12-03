const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testCrud() {
    console.log('--- STARTING CRUD TEST ---');
    try {
        let token;
        // 1. Auth
        try {
            console.log('Attempting Register...');
            const res = await axios.post(`${API_URL}/auth/register`, {
                username: 'cruduser',
                email: 'crud@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('AUTH: Registered');
        } catch (e) {
            console.log('Register failed, attempting Login...');
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'crud@example.com',
                password: 'password123'
            });
            token = res.data.token;
            console.log('AUTH: Logged in');
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Task
        try {
            console.log('Creating Task...');
            const taskRes = await axios.post(`${API_URL}/tasks`, {
                title: 'Test CRUD Task',
                priority: 'High',
                difficulty: 'Medium',
                estimated_time: 30
            }, { headers });
            console.log('TASK CREATED:', taskRes.status, taskRes.data.title);
        } catch (e) {
            console.log('TASK FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

        // 3. Log Mood
        try {
            console.log('Logging Mood...');
            const moodRes = await axios.post(`${API_URL}/moods`, {
                mood_score: 7,
                stress_level: 3,
                motivation_level: 8,
                note: 'Testing CRUD'
            }, { headers });
            console.log('MOOD LOGGED:', moodRes.status, moodRes.data.mood_score);
        } catch (e) {
            console.log('MOOD FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

        // 4. AI Schedule
        try {
            console.log('Generating Schedule...');
            const scheduleRes = await axios.post(`${API_URL}/ai/schedule`, {}, { headers });
            console.log('SCHEDULE:', scheduleRes.status);
        } catch (e) {
            console.log('SCHEDULE FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

        // 5. AI Chat
        try {
            console.log('Chatting with AI...');
            const chatRes = await axios.post(`${API_URL}/ai/chat`, { message: 'Hello' }, { headers });
            console.log('CHAT:', chatRes.status);
            console.log('REPLY:', chatRes.data.reply);
        } catch (e) {
            console.log('CHAT FAILED:', e.message);
            if (e.response) console.log('DATA:', JSON.stringify(e.response.data));
        }

    } catch (error) {
        console.log('FATAL ERROR:', error.message);
        if (error.response) console.log('DATA:', JSON.stringify(error.response.data));
    }
    console.log('--- END TEST ---');
}

testCrud();
