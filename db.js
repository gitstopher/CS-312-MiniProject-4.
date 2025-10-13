const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogDb',
    password: '112721Carina!',
    port: 5432,
});

module.exports = pool;