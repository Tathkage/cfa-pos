// connectionVerification.js

const { Pool } = require('pg');

// Set up a connection pool to the PostgreSQL database
const pool = new Pool({
    user: 'tathluac_tathluach',
    host: '104.225.208.23',
    database: 'tathluac_cfa_pos',
    password: 'sBzBgVcDIprafTfmmknC',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Simple query to check the connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error executing query:', err);
    } else {
        console.log('Connection to PostgreSQL successful. Current timestamp:', result.rows[0].now);
    }

    // Close the pool to end the script
    pool.end();
});
