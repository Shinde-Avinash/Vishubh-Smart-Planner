const { Task, User } = require('../models');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user_id: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'creator', attributes: ['id', 'username'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                [Op.or]: [
                    { user_id: req.user.id },
                    { assigned_to: req.user.id }
                ]
            }
        });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
