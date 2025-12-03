require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiPro() {
    console.log('Testing Gemini Pro...');
    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Hello, are you working?";
        console.log('Sending prompt:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('SUCCESS:', text);
    } catch (error) {
        console.error('FAILURE:', error.message);
        if (error.response) {
            console.error('Error Details:', JSON.stringify(error.response, null, 2));
        }
    }
}

testGeminiPro();
