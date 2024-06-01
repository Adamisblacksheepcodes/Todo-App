const { Pool } = require("pg");

const pool = new Pool({
    // user: "postgres",
    // password: "postgres",
    // host: "localhost",
    // port: 5432,
    // database: "perntodo"

    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    
});

module.exports = pool;
