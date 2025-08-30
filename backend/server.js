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
const PORT = 4000;

app.use(
  cors({
    origin: 'https://resu-mate-five.vercel.app',
    credentials: true,
  })
);

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
        'https://resu-mate-five.vercel.app'
      );
    },
  })
);

// Router
app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(PORT, () => {
  console.log(`Server is starting at PORT No at ${PORT}`);
});
