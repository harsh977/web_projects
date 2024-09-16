const { Pool } = require('pg'); // Use Pool instead of Client

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "paytm",
    password: "harsh123",
    port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
