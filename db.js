const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogDb',
    password: '112721Carina!',
    port: 5432,
});

pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL');
        client.release();
    })
    .catch(err => console.error('Database connection error:', err.stack));
module.exports = pool;