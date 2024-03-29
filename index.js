const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// midaleware connection
// userName: expressClientServer
// userPass: aU3j0KuSuRBS1uow

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://expressClientServer:aU3j0KuSuRBS1uow@cluster0.xuwndrj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const databaseCollection = client.db("insertDB").collection("users");

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await databaseCollection.insertOne(user)
            res.send(result)
        })

        app.get("/users", async (req, res) => {
            const result = await databaseCollection.find().toArray();
            res.send(result);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id), };
            const result = await databaseCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id), };
            const result = await databaseCollection.findOne(query);
            res.send(result);
        })

        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("id", id, data);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUSer = {
                $set: {
                    name: data.name,
                    email:data.email,
                    password: data.password,
                },
            };
            const result = await databaseCollection.updateOne(
                filter,
                updatedUSer,
                options
            );
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})