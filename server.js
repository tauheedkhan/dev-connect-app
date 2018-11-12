const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const app = express();


const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello API world')
})