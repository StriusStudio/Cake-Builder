import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { developmentLogger, productionLogger, errorHandler } from './middleware/logger.js';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: './src/config/config.env' });

// Set colors
dotenv.config({ path: './src/config/config.env' });

// Set colors
colors.setTheme({
  success: ['bgGreen', 'black', 'bold'],
  error: ['bgRed', 'white', 'bold'],
  warn: ['bgYellow', 'black', 'bold'],
  info: ['bgBlue', 'white', 'bold'],
  debug: ['bgMagenta', 'white', 'bold'],
  log: ['bgWhite', 'black']
});

// Import routes
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Import error handler
import ErrorResponse from './utils/errorResponse.js';

// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(developmentLogger);
} else {
  app.use(productionLogger);
}

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  }
});

// Apply rate limiting to all API routes
app.use('/api', limiter);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['price', 'ratingsAverage', 'ratingsQuantity'],
  })
);

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add request time to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount routers
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running successfully 🚀' });
});

// Handle 404 - Not Found
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error 💥', err);
    
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    
    // 1) Log error
    console.error('ERROR 💥', err);
    
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();