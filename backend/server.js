import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import resumeRouter from './routes/resumeRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://your-frontend-domain.vercel.app',
          'https://resu-mate-five.vercel.app',
        ]
      : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);

app.use(
  '/upload',
  express.static(path.join(__dirname, 'upload'), {
    setHeaders: (res, path) => {
      res.set(
        'Access-Control-Allow-Origin',
        process.env.NODE_ENV === 'production'
          ? 'https://your-frontend-domain.vercel.app'
          : 'http://localhost:5173'
      );
    },
  })
);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!', status: 'success' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
export default app;

// Only start server in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}
