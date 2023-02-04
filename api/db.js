import pg from "pg";
const { Pool } = pg;

// TODO: make connection to docker postgres image
// localhost connection
export const pool = new Pool({
    user: "postgres", 
    password: "root",
    host: "localhost",
    port: 5432,
    database: "foodreceipt"
});