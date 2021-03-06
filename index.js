const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const verify = require('jsonwebtoken/verify');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Parts-Manufacturer')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.envvjmb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}


async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('partsManufacturer').collection('parts');
        const userCollection = client.db('partsManufacturer').collection('users');
        const userReview = client.db('partsManufacturer').collection('review');
        // //get toolsParts
        app.get('/getParts', async (req, res) => {
            const toolsPart = await partsCollection.find().toArray();
            res.send(toolsPart)
        })
        //tools and parts 
        app.get('/getParts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await partsCollection.findOne(query);
            res.send(service);
        })


        app.post('/addParts', async (req, res) => {
            const addParts = req.body;
            const result = await partsCollection.insertOne(addParts);
            res.send(result);
        })
        //add review 
        app.get('/getReview', async (req, res) => {
            const getReview = await userReview.find().toArray();
            res.send(getReview);
        })
        app.post('/addReview', async (req, res) => {
            const addReview = req.body;
            const result = await userReview.insertOne(addReview);
            res.send(result);
        })

        // user database create
        app.get('/user', async (req, res) => {
            const totalUser = await userCollection.find().toArray();
            res.send(totalUser)
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);



            //token insert in database
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        })

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        })

        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        // profile update database
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const updateUser = req.body;
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
                $set: updateUser,
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})