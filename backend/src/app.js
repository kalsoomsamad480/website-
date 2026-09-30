import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import env from './config/env.js';
import corsOptions from './config/corsOptions.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import sanitizeBody from './middleware/sanitizeMiddleware.js';
import notFound from './middleware/notFoundMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

if (env.isProduction) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(sanitizeBody);
if (!env.isProduction) app.use(morgan('dev'));

app.use('/api/v1', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
