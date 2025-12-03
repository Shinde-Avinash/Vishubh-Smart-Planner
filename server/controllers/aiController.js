const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Task, MoodLog } = require('../models');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback Chat Response
const getFallbackChatResponse = (message, context) => {
    if (context === 'breakdown') {
        return "I'm currently running in offline mode, but here's a general guide to breaking down tasks:\n1. Identify the main goal.\n2. Split it into 3-5 smaller steps.\n3. Assign a deadline to each step.\n4. Start with the easiest one!";
    }
    if (context === 'motivation') {
        return "Even when things are tough, you're making progress! 'The only way to do great work is to love what you do.' - Steve Jobs. You've got this!";
    }
    return "I'm having trouble connecting to the cloud right now, but I'm here to listen. How can I help you organize your tasks manually?";
};

// Fallback Schedule Generator
const getFallbackSchedule = (tasks) => {
    const schedule = [];
    let currentTime = 9; // Start at 9 AM

    schedule.push({
        time: "09:00 AM - 09:30 AM",
        task: "Morning Routine",
        reason: "Start the day with a clear mind.",
        type: "Routine"
    });

    tasks.forEach((task, index) => {
        if (currentTime >= 17) return; // Stop at 5 PM

        const startTime = `${currentTime < 12 ? currentTime : currentTime - 12}:00 ${currentTime < 12 ? 'AM' : 'PM'}`;
        const endTime = `${currentTime + 1 < 12 ? currentTime + 1 : currentTime + 1 - 12}:00 ${currentTime + 1 < 12 ? 'AM' : 'PM'}`;

        schedule.push({
            time: `${startTime} - ${endTime}`,
            task: task.title,
            reason: `Priority: ${task.priority}`,
            type: "Work"
        });

        currentTime++;

        if (index % 2 !== 0) {
            const breakStart = `${currentTime < 12 ? currentTime : currentTime - 12}:00 ${currentTime < 12 ? 'AM' : 'PM'}`;
            const breakEnd = `${currentTime < 12 ? currentTime : currentTime - 12}:15 ${currentTime < 12 ? 'AM' : 'PM'}`;
            schedule.push({
                time: `${breakStart} - ${breakEnd}`,
                task: "Short Break",
                reason: "Recharge your energy.",
                type: "Break"
            });
        }
    });

    return schedule;
};

exports.chat = async (req, res) => {
    try {
        const { message, context } = req.body;
        console.log('Received AI chat message:', message, 'Context:', context);

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY missing, using fallback.');
            return res.json({ reply: getFallbackChatResponse(message, context) });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let systemInstruction = "You are Vishubh, an AI productivity assistant. You help users with task management, motivation, and scheduling. Be concise, encouraging, and practical.";
        if (context === 'breakdown') systemInstruction += " The user wants to break down a complex task. Provide a step-by-step checklist.";
        if (context === 'motivation') systemInstruction += " The user needs motivation. Provide an inspiring quote or a practical tip.";

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood. I am ready to assist you as Vishubh." }] },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.json({ reply: getFallbackChatResponse(message, context) });
    }
};

exports.generateSchedule = async (req, res) => {
    console.log('generateSchedule called');
    try {
        if (!req.user || !req.user.id) {
            throw new Error('User not authenticated');
        }
        const tasks = await Task.findAll({ where: { user_id: req.user.id, status: 'Pending' } });
        const moods = await MoodLog.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            limit: 1
        });

        const currentMood = moods.length > 0 ? moods[0] : { mood_score: 5, stress_level: 5, motivation_level: 5 };

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY missing, using fallback.');
            return res.json({ schedule: { schedule: getFallbackSchedule(tasks) } });
        }

        const prompt = `
            You are an expert productivity scheduler. Create an optimal daily schedule for me based on the following:
            
            **My Current State:**
            - Mood: ${currentMood.mood_score}/10
            - Stress: ${currentMood.stress_level}/10
            - Motivation: ${currentMood.motivation_level}/10

            **Pending Tasks:**
            ${JSON.stringify(tasks.map(t => ({
            title: t.title,
            priority: t.priority,
            difficulty: t.difficulty,
            estimated_time: t.estimated_time || '30 mins'
        })))}

            **Output Format:**
            Return a JSON object with a "schedule" array. Each item should have:
            - "time": "Start - End"
            - "task": "Task Title"
            - "reason": "Why this task now?"
            - "type": "Work" | "Break" | "Routine"
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json({ schedule: JSON.parse(text) });

    } catch (error) {
        console.error('AI Schedule Error:', error);
        try {
            const tasks = await Task.findAll({ where: { user_id: req.user.id, status: 'Pending' } });
            res.json({ schedule: { schedule: getFallbackSchedule(tasks) } });
        } catch (fallbackError) {
            console.error('Fallback failed:', fallbackError);
            // Return a generic schedule if DB fails
            res.json({ schedule: { schedule: getFallbackSchedule([]) } });
        }
    }
};
