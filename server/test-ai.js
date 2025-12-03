require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // List models
        /*
        // Note: listModels might not be available in all versions or requires specific setup. 
        // Instead, let's just try a different model if the first one fails.
        */

        console.log('Testing gemini-1.5-flash...');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hello");
            console.log('Success with gemini-1.5-flash:', result.response.text());
            return;
        } catch (e) {
            console.log('gemini-1.5-flash failed:', e.message);
        }

        console.log('Testing gemini-pro...');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log('Success with gemini-pro:', result.response.text());
        } catch (e) {
            console.log('gemini-pro failed:', e.message);
        }

    } catch (error) {
        console.error('Gemini Test Failed:', error);
    }
}

testGemini();
