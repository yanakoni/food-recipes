import  express  from "express";
import { Environment } from "./packages/general/environment.js"
import {router} from "./routes/userroutes.js"

const PORT = Environment.config.http.LOCAL_PORT;
const app = express();

app.use('/api/user', router);
app.get('/', (req, res) => {
    res.send("<h1>it works!!!!!!</h1>");
});

app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT}...`);
});
