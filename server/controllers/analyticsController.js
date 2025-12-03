const { MoodLog, Task, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAnalytics = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch Mood Logs for the last 7 days
        const moodLogs = await MoodLog.findAll({
            where: {
                user_id: req.user.id,
                createdAt: { [Op.gte]: sevenDaysAgo }
            },
            order: [['createdAt', 'ASC']]
        });

        // Fetch Completed Tasks for the last 7 days
        const completedTasks = await Task.findAll({
            where: {
                user_id: req.user.id,
                status: 'Completed',
                updatedAt: { [Op.gte]: sevenDaysAgo }
            }
        });

        // Aggregate data by date
        const analyticsData = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dailyMoods = moodLogs.filter(m => m.createdAt.toISOString().startsWith(dateStr));
            const dailyTasks = completedTasks.filter(t => t.updatedAt.toISOString().startsWith(dateStr));

            const avgMood = dailyMoods.length > 0
                ? dailyMoods.reduce((sum, m) => sum + m.mood_score, 0) / dailyMoods.length
                : 0;

            analyticsData.push({
                date: dateStr,
                mood: Math.round(avgMood * 10) / 10,
                tasksCompleted: dailyTasks.length
            });
        }

        res.json(analyticsData.reverse());
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
