require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('Testing Gemini API...');
    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is missing in .env');
        return;
    }
    console.log('API Key present (length: ' + process.env.GEMINI_API_KEY.length + ')');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('Trying to use model: gemini-pro');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('SUCCESS with gemini-pro:', response.text());
    } catch (error) {
        console.error('FAILURE with gemini-pro:', error.message);
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('Trying to use model: gemini-1.5-flash');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('SUCCESS with gemini-1.5-flash:', response.text());
    } catch (error) {
        console.error('FAILURE with gemini-1.5-flash:', error.message);
    }
}

testGemini();
