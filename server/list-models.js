require('dotenv').config();
const axios = require('axios');

async function listModels() {
    console.log('Listing models via REST API...');
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('No API Key found');
        return;
    }

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        console.log('Models found:');
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error('Failed to list models:', error.response ? error.response.data : error.message);
    }
}

listModels();
