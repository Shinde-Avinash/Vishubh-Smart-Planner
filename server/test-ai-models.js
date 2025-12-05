require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
    console.log('Testing multiple models...');
    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTest = [
        "gemini-pro",
        "models/gemini-pro",
        "gemini-1.5-flash",
        "models/gemini-1.5-flash",
        "gemini-1.0-pro",
        "gemini-2.0-flash-exp"
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            return; // Stop after first success
        } catch (error) {
            console.error(`FAILURE with ${modelName}:`, error.message);
        }
    }
    console.log('\nAll models failed.');
}

testModels();
