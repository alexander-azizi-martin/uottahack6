const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

router.use(express.json());

router.post('/cars', (req, res) => {
    const { id, mileage, battery_charge, battery_health, max_range, last_recorded_location, routes_list } = req.body; 
    const connection = mysql.createConnection(process.env.DATABASE_URL);

    const query = 'INSERT INTO Cars (id, mileage, battery_charge, battery_health, max_range, last_recorded_location, routes_list) VALUES (?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, [id, mileage, battery_charge, battery_health, max_range, last_recorded_location, routes_list], (error, results) => {
        if (error) throw error;
        res.status(201).json({ message: 'Car added successfully', carId: results.insertId });
        connection.end();
    });
});

module.exports = router;
