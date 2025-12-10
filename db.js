const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'krish',
    host: 'localhost',
    port:5432,
    db: 'krish_db'
});

module.exports = {
    query: (text, params) => pool.query(text,params),
};