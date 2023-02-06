import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { usersRouter } from './routes/usersRouter.js';
import { mealsRouter } from './routes/mealsRouter.js';
import { errorLogger, errorResponder, invalidPathHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.disable('x-powered-by');
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['Access-Token', 'Refresh-Token', 'Content-Type'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS'],
  })
);

app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/user', usersRouter);
app.use('/meal', mealsRouter);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}...`);
});
