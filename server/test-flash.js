require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log('STARTING TEST (gemini-pro)');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('SUCCESS:', response.text());
    } catch (error) {
        console.error('ERROR:', error.message);
    }
    console.log('ENDING TEST');
}

testGemini();
