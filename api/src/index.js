import  express  from "express";
import {usersRouter} from "./routes/usersRouter.js"
import { mealsRouter } from "./routes/mealsRouter.js";
import {errorHandler} from "./errors.js";

const app = express();
const API_PORT = process.env.API_PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.use('/user', usersRouter);
app.use('/meal', mealsRouter);
app.use(errorHandler);

app.listen(API_PORT, () => {
    console.log(`Server has been started on ${API_PORT}...`);
});
