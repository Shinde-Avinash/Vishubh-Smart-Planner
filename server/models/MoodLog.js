module.exports = (sequelize, DataTypes) => {
    const MoodLog = sequelize.define('MoodLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mood_score: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 10 },
        },
        stress_level: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 10 },
        },
        motivation_level: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 10 },
        },
        note: {
            type: DataTypes.TEXT,
        },
    });

    MoodLog.associate = (models) => {
        MoodLog.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return MoodLog;
};
