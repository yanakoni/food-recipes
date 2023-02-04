import  express  from "express";
import {router} from "./routes/userroutes.js"

require("dotenv")
  .config();

const app = express();
const PORT = process.env.LOCAL_PORT ?? 3000;


app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.use('/user', router);

app.get('/', (req, res) => {
    res.send("<h1>it works!!!!!!</h1>");
});

app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT}...`);
});
