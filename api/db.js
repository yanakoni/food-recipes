import pg from "pg";
const { Pool } = pg;

// docker connection
export const pool = new Pool({
    user: "postgres", 
    password: "postgres",
    host: "postgres",
    port: 5432,
    database: "food-db"
});