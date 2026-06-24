/**
 * Givista Backend Server
 * 
 * This is the main entry point for the Express server.
 * It sets up middleware, routes, and starts listening on the configured PORT.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { sequelize } from './config/database';

// Import models to ensure they're registered
import './models/User.model';
import './models/Verification.model';
import './models/Donation.model';
import './models/Request.model';
import './models/Message.model';
import './models/Recommendation.model';
import './models/Match.model';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import donationRoutes from './routes/donation.routes';
import requestRoutes from './routes/request.routes';
import recommendationRoutes from './routes/recommendation.routes';
import messageRoutes from './routes/message.routes';
import verificationRoutes from './routes/verification.routes';
import matchRoutes from './routes/match.routes';
import adminRoutes from './routes/admin.routes';
import donorRoutes from './routes/donor.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import privacyRoutes from './routes/privacy.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ==================== MIDDLEWARE ====================

// CORS: Allow frontend to communicate with backend
// Enhanced CORS configuration with proper preflight handling
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3000',
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly for preflight
app.options('*', cors(corsOptions));

// Body Parser: Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files: Serve uploaded images
// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static('uploads'));

// Request logging middleware (optional, for debugging)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Givista API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes with version prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/verification', verificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/privacy', privacyRoutes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ==================== ERROR HANDLER ====================

// Global error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database models (creates tables if they don't exist)
    // Note: In production, use migrations instead of sync
    if (process.env.NODE_ENV !== 'production') {
      try {
        // First, fix any existing data that doesn't match new constraints
        const [results] = await sequelize.query(`
          UPDATE users 
          SET location = COALESCE(location, 'Unknown') 
          WHERE location IS NULL OR LENGTH(location) > 200;
        `).catch(() => [[], []]); // Ignore if table doesn't exist yet
        
        // Update any location values that are too long
        await sequelize.query(`
          UPDATE users 
          SET location = SUBSTRING(location, 1, 200) 
          WHERE LENGTH(location) > 200;
        `).catch(() => {}); // Ignore if no data to update
        
        // Now sync the schema with error handling for constraint issues
        try {
          await sequelize.sync({ alter: true });
          console.log('✅ Database models synced.');
        } catch (alterError: any) {
          // Handle constraint/deadlock errors gracefully
          if (alterError.name === 'SequelizeUnknownConstraintError' || 
              alterError.name === 'SequelizeDatabaseError' &&
              (alterError.parent?.code === 'ER_LOCK_DEADLOCK' || 
               alterError.original?.code === 'ER_LOCK_DEADLOCK' ||
               alterError.message?.includes('Constraint') ||
               alterError.message?.includes('does not exist'))) {
            console.log('⚠️  Constraint/deadlock detected, trying sync without alter...');
            try {
              // Try sync without alter (just check tables exist)
              await sequelize.sync();
              console.log('✅ Database models synced (without alter).');
            } catch (syncError2: any) {
              // If still fails, just log and continue (tables likely already exist)
              console.log('⚠️  Sync warning (continuing anyway):', syncError2.message?.substring(0, 100));
              console.log('ℹ️  If you see database errors, tables may need manual fixing.');
            }
          } else if (alterError.name === 'SequelizeDatabaseError' && 
              (alterError.parent?.code === 'WARN_DATA_TRUNCATED' || 
               alterError.parent?.sqlMessage?.includes('Data truncated'))) {
            console.log('⚠️  Fixing existing data conflicts...');
            try {
              // Drop and recreate tables (development only!)
              await sequelize.sync({ force: true });
              console.log('✅ Database tables recreated.');
            } catch (forceError) {
              console.error('❌ Unable to fix database:', forceError);
              throw forceError;
            }
          } else {
            // Log but don't throw - allow server to start even if sync has issues
            console.error('⚠️  Sync error (server will continue):', alterError.message?.substring(0, 200));
          }
        }
      } catch (syncError: any) {
        // Final fallback - log but continue
        console.error('⚠️  Database sync warning (continuing):', syncError.message?.substring(0, 200));
      }
    }

    // Start listening
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Kill the process using it first.`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

