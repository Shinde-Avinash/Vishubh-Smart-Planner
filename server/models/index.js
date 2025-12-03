const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const Task = require('./Task')(sequelize, DataTypes);
const MoodLog = require('./MoodLog')(sequelize, DataTypes);

const db = {
    sequelize,
    Sequelize: require('sequelize'),
    User,
    Task,
    MoodLog,
};

// Associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
