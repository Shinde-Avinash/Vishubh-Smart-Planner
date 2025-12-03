const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
