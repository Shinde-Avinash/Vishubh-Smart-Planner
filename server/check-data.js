const { Task, MoodLog, User } = require('./models');

async function checkData() {
    try {
        const userCount = await User.count();
        const taskCount = await Task.count();
        const moodCount = await MoodLog.count();

        console.log('--- DB STATUS ---');
        console.log(`Users: ${userCount}`);
        console.log(`Tasks: ${taskCount}`);
        console.log(`Moods: ${moodCount}`);
        console.log('-----------------');

        if (userCount > 0) {
            const user = await User.findOne();
            console.log(`First User: ${user.username} (ID: ${user.id})`);
            const userTasks = await Task.count({ where: { user_id: user.id } });
            console.log(`Tasks for ${user.username}: ${userTasks}`);
        }

    } catch (error) {
        console.error('DB Check Failed:', error);
    }
}

checkData();
