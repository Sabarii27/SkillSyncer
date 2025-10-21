const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
// Also try .env file as fallback
if (!process.env.PORT) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Debug: Check if environment variables are loaded
console.log('🔍 Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable cors
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/community', require('./routes/community'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/interview', require('./routes/interview'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
