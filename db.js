const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',  // Use the environment variable or default to localhost
    user: process.env.DB_USER || 'root',      // Use the environment variable or default to 'root'
    password: process.env.DB_PASSWORD || 'Issac@2003', // Use the environment variable or default to your password
    database: process.env.DB_DATABASE || 'booking_db'  // Use the environment variable or default to 'booking_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = connection;
