const { MoodLog } = require('../models');

exports.logMood = async (req, res) => {
    try {
        console.log('Received mood log request:', req.body);
        console.log('User ID:', req.user.id);
        const mood = await MoodLog.create({ ...req.body, user_id: req.user.id });
        console.log('Mood created:', mood);
        res.status(201).json(mood);
    } catch (error) {
        console.error('Error logging mood:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getMoods = async (req, res) => {
    try {
        const moods = await MoodLog.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 7 // Last 7 entries
        });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMood = async (req, res) => {
    try {
        const { id } = req.params;
        const mood = await MoodLog.findOne({ where: { id, user_id: req.user.id } });

        if (!mood) {
            return res.status(404).json({ error: 'Mood log not found' });
        }

        await mood.update(req.body);
        res.json(mood);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMood = async (req, res) => {
    try {
        const { id } = req.params;
        const mood = await MoodLog.findOne({ where: { id, user_id: req.user.id } });

        if (!mood) {
            return res.status(404).json({ error: 'Mood log not found' });
        }

        await mood.destroy();
        res.json({ message: 'Mood log deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
