const express = require('express');

const router = express.Router();

const mysql = require('mysql2');

router.get('/cars', (req, res) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query('SELECT * FROM Cars', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
        connection.end();
    }
    )
}
)


module.exports = router;