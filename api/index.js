import  express  from "express";
import {router} from "./routes/userroutes.js"

const app = express();
const PORT = process.env.LOCAL_PORT ?? 3000;

app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.send("<h1>it works!!!!!!</h1>");
});

app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT}...`);
});
