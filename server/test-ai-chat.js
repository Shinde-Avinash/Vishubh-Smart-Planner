require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAIChat() {
    console.log('Testing AI Chat with gemini-pro and legacy history...');
    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is missing');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const systemInstruction = "You are Vishubh, an AI productivity assistant. You help users with task management, motivation, and scheduling. Be concise, encouraging, and practical.";

        console.log('Model Config:', { model: "gemini-1.5-flash" });

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest"
        });

        console.log('Starting chat...');
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood. I am ready to assist you as Vishubh." }] },
            ],
        });

        const message = "I'm feeling unmotivated. Help me get started!";
        console.log('Sending message:', message);

        const result = await chat.sendMessage(message);
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

testAIChat();
