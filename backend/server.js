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

// Fixed CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://resu-mate-e1x1.vercel.app', // ✅ Removed trailing slash
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);

// Fixed static file serving
app.use(
  '/upload',
  express.static(path.join(__dirname, 'upload'), {
    setHeaders: (res, path) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://resu-mate-e1x1.vercel.app',
      ];
      const origin = res.req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
      }
    },
  })
);

// Router
app.get('/', (req, res) => {
  res.json({ message: 'API WORKING', status: 'success' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Export for Vercel deployment
export default app;

// Only listen in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is starting at PORT No at ${PORT}`);
  });
}
