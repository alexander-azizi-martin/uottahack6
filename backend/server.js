const express = require('express');
const app = express();

require('dotenv').config()

const router = require('./routes/cars');

app.use(router)

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' })
})


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});









