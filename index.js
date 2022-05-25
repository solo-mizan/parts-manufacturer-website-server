const { MongoClient, ServerApiVersion, ObjectId } = reqire('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// mongodb config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udusb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

// middleware
app.use(cors());
app.use(express.json());





app.get('/', async (req, res) => {
    res.send('Car Geeks Server is Running');
});

app.listen(port, () => {
    console.log('Car Geeks listening to port', port);
})
