const express = require('express');
const app = express();

require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')
connection.end() 

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' }); 
    });

app.get('/cars', (req, res) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query('SELECT * FROM Cars', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
        connection.end();
    }
    );
}
);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});