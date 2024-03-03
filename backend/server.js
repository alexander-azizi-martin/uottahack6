const express = require('express');
const app = express();

require('dotenv').config()

const carRouter = require('./routes/cars');

const findCarRouter = require('./routes/findCarRoute');

app.use(carRouter)
app.use(findCarRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' })
})


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});









