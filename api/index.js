import  express  from "express";
import { Environment } from "./packages/general/environment.js"
import userRouter from "./routes/userroutes"

const PORT = Environment.config.http.LOCAL_PORT;
const app = express();

app.use('/api/user', userRouter);
app.get('/', (req, res) => {
    res.send("<h1>it works!!!!!!</h1>");
});

app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT}...`);
});
