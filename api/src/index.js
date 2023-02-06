import express from 'express';
import { usersRouter } from './routes/usersRouter.js';
import { mealsRouter } from './routes/mealsRouter.js';
import { errorHandler } from './errors.js';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/user', usersRouter);
app.use('/meal', mealsRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}...`);
});
