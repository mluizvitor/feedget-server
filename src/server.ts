import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { routes } from './routes';

const app = express();

app.use(cors({
  origin: process.env.WEB_CLIENT_DOMAIN!,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}))
app.use(routes);

app.listen(process.env.PORT || 3333, () => {
  console.log('==> HTTP server running <==')
})