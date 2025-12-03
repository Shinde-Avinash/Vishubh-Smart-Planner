const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testPrivacy() {
    try {
        // 1. Register/Login User A
        console.log('--- Registering User A ---');
        const userA = { username: 'UserA_' + Date.now(), email: 'usera_' + Date.now() + '@test.com', password: 'password123' };
        let resA;
        try {
            resA = await axios.post(`${API_URL}/auth/register`, userA);
        } catch (e) {
            // If already exists (unlikely with timestamp), try login
            resA = await axios.post(`${API_URL}/auth/login`, { email: userA.email, password: userA.password });
        }
        const tokenA = resA.data.token;
        console.log('User A Token:', tokenA.substring(0, 10) + '...');

        // 2. Log Mood for User A
        console.log('--- Logging Mood for User A ---');
        await axios.post(`${API_URL}/moods`, {
            mood_score: 8,
            stress_level: 2,
            motivation_level: 9,
            notes: 'User A Mood'
        }, { headers: { Authorization: `Bearer ${tokenA}` } });

        // 3. Register/Login User B
        console.log('--- Registering User B ---');
        const userB = { username: 'UserB_' + Date.now(), email: 'userb_' + Date.now() + '@test.com', password: 'password123' };
        const resB = await axios.post(`${API_URL}/auth/register`, userB);
        const tokenB = resB.data.token;
        console.log('User B Token:', tokenB.substring(0, 10) + '...');

        // 4. Fetch Moods as User B
        console.log('--- Fetching Moods as User B ---');
        const moodsB = await axios.get(`${API_URL}/moods`, { headers: { Authorization: `Bearer ${tokenB}` } });

        console.log(`User B found ${moodsB.data.length} moods.`);

        if (moodsB.data.length === 0) {
            console.log('SUCCESS: User B cannot see User A\'s moods.');
        } else {
            console.log('FAILURE: User B can see moods!');
            console.log(moodsB.data);
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testPrivacy();
