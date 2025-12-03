module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        difficulty: {
            type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
            defaultValue: 'Medium',
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Medium',
        },
        deadline: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Postponed', 'Waiting', 'Closed'),
            defaultValue: 'Pending',
        },
        estimated_time: {
            type: DataTypes.INTEGER, // In minutes
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });

    Task.associate = (models) => {
        Task.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' });
        Task.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'assignee' });
    };

    return Task;
};
