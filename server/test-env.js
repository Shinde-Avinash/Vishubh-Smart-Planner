const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('DOTENV ERROR:', result.error);
}

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('GEMINI_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set');
