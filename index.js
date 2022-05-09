const express = require('express');
const cors = require('cors');
const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// use middleware
const corsConfig = {
    origin: true,
    credentials: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json());

// main Work

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.27urz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('connect')
        const productCollection = client.db('warehouse').collection('products')

        // All item API 
        app.get('/allitem', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
            // ALL ITEMS LINK : http://localhost:5000/allitem
            // server link https://salty-everglades-57172.herokuapp.com/allitem
        });

        // Get Per item data

        app.get('/stokeupdate/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.send(service);
            // Link : http://localhost:5000/updatequantity/${id}
        });
        // Stoke Update
        app.put("/updatequantity/:id", async (req, res) => {
            const id = req.params.id;
            const updateStoke = req.body;
            console.log(updateStoke)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateStoke.NewQuantity
                }
            };

            const result = await productCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        });
        // For adding a new Item
        app.post('/additem', async (req, res) => {
            const newitem = req.body;
            const result = await productCollection.insertOne(newitem);
            res.send(result)
        });
        // For My Item
        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        // delete Item

        app.delete("/deleteQuantity/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir())

app.get('/', (req, res) => {
    res.send('Running My Node CRUD Server');
});

app.listen(port, () => {
    console.log('CRUD Server is running');
})

// username:wareHouse
// pass : wqU1koZroQFBlXwK