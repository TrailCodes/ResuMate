import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import resumeRouter from './routes/resumeRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

//Connect DB
connectDB();

//Middlewaare
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);

app.use(
  '/upload',
  express.static(path.join(__dirname, 'uplaod'), {
    setHeaders: (req, _path) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    },
  })
);
//Router
app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(PORT, () => {
  console.log(`Server is starting at PORT No at ${PORT}`);
});
