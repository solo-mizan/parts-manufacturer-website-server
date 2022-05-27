const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
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

async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db('car_geeks').collection('tools');
        const productCollection = client.db('car_geeks').collection("products");
        const userCollection = client.db('car_geeks').collection("users");
        const orderCollection = client.db('car_geeks').collection("orders");
        const reviewCollection = client.db('car_geeks').collection("reviews");

        // get all tools collection
        app.get('/tools', async (req, res) => {
            const tools = await toolsCollection.find().toArray();
            res.send(tools);
        });

        // get singel item detail
        app.get('/itemDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const itemDetail = await toolsCollection.findOne(query);
            res.send(itemDetail);
        });

        // store new user email
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);

            // add a new product
            app.post('/tools', async (req, res) => {
                const body = req.body;
                const result = await toolsCollection.insertOne(body);
                res.send(result);
            });

            // update user profile
            app.put('/profile/:email', async (req, res) => {
                const email = req.params.email;
                const body = req.body;
                const query = { email: email };
                const updateDoc = {
                    $set: body
                };
                const result = await userCollection.updateOne(query, updateDoc);
                res.send(result);
            });

            // get user's existing profile data
            app.get('/user/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email: email };
                const result = await userCollection.findOne(query);
                res.send(result);
            });

            // get single user order
            app.get('/myorder/:email', async (req, res)=> {
                const email = req.params.email;
                const query = {userEmail: email};
                const result = await orderCollection.findOne(query).toArray;
                res.send(result);
            });

            // admin
            app.get("/admin/:email", async (req, res) => {
                const email = req.params.email;
                const query = { email: email };
                const user = await userCollection.findOne(query);
                const isAdmin = user.role === "admin";
                res.send({ admin: isAdmin });
            });

        })

    }
    finally { }
}

run().catch(console.dir);

// server running check api
app.get('/', async (req, res) => {
    res.send('Car Geeks Server is Running');
});

app.listen(port, () => {
    console.log('Car Geeks listening to port', port);
})
