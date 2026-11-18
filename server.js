const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { MongoClient } = require('mongodb');
const swaggerDocument = require('./swagger.json');

// Import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const professionalRoutes = require('./frontend/routes/professional');
const projectsRoutes = require('./routes/projects');
const projectsService = require('./services/projectsService');

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
app.use('/api/projects', projectsRoutes);

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
  res.status(err.status || 500).json({
    error: err.status === 400 ? 'Validation error' : 'Something went wrong!',
    message: err.message
  });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set before starting the server.');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const database = client.db(process.env.DB_NAME || 'portfolio');
    projectsService.setProjectsCollection(database.collection('projects'));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    await client.close().catch(() => {});
    throw error;
  }
}

startServer().catch((error) => {
  console.error('Unable to start application:', error.message);
  process.exit(1);
});
