const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const professionalRoutes = require('./frontend/routes/professional');

dotenv.config();
require('./config/passport-config');

const app = express();
const PORT = process.env.PORT || 8080;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in the environment before starting the server.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/professional', professionalRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Catch-all route for undefined routes
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    message: `Cannot GET ${req.path}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
