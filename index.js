const express = require('express')
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const verify = require('jsonwebtoken/verify');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Assignment 12!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.envvjmb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'UnAuthorized access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     });
// }


async function run() {
    try {
        await client.connect();
        // const toolsCollection = client.db('Assignment-12').collection('services');
        // const userCollection = client.db('Assignment-12').collection('users');
        // const userReview = client.db('Assignment-12').collection('review');
        // //get toolsParts
        // app.get('/toolsParts', async (req, res) => {
        //     const toolsPart = await toolsCollection.find().toArray();
        //     res.send(toolsPart)
        // })
        // //tools and parts id 
        // app.get('/toolsParts/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await toolsCollection.findOne(query);
        //     res.send(service);
        // })


        // app.post('/addTools', async (req, res) => {
        //     const addToolsParts = req.body;
        //     const result = await toolsCollection.insertOne(addToolsParts);
        //     res.send(result);
        // })
        // //add review 
        // app.get('/getReview', verifyJWT, async (req, res) => {
        //     const getReview = await userReview.find().toArray();
        //     res.send(getReview)
        // })
        // app.post('/addReview', async (req, res) => {
        //     const addReview = req.body;
        //     const result = await userReview.insertOne(addReview);
        //     res.send(result);
        // })

        // // user create database
        // app.put('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const option = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     }
        //     const result = await userCollection.updateOne(filter, updateDoc, option);

        //     //token insert
        //     const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        //     res.send({ result, token });
        // })


    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`Example app listening on port ${ port }`)
})