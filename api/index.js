import  express  from "express";
import { Environment } from "./packages/general/environment.js"

const PORT = Environment.config.http.LOCAL_PORT;
const app = express();
app.listen(PORT, () => {
    console.log("Server has been started on PORT 3000...");
});
