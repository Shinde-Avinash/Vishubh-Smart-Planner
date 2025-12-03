const dotenv = require('dotenv');
dotenv.config();
console.log('STARTING NEW SERVER VERSION ' + Date.now());
console.log('DEBUG: DB_USER=', process.env.DB_USER);
console.log('DEBUG: DB_HOST=', process.env.DB_HOST);
console.log('DEBUG: GEMINI_KEY=', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set');
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Vishubh Scheduling Companion API is running');
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
