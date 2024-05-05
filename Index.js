const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongodb');

const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2igrt7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // database collections
    const userCollection = client.db("docHouseDB").collection("Users");
    const doctorCollection = client.db("docHouseDB").collection("Doctors");
    const serviceCollection = client.db("docHouseDB").collection("Services");
    const appointmentCollection = client.db("docHouseDB").collection("Appointments");

    // CURD operations

    // user related api
    app.post("/api/v1/users", async (req, res) => {
      const data = req.body;
      const query = { email: data.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.status(400).json({ error: "user already exist" });
      }
      const result = await userCollection.insertOne(data);
      res.send(result);
    });
    // ================
    app.get("/api/v1/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // =============
    app.get("/api/v1/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // ===========
    app.delete("/api/v1/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // =============
    app.put("/api/v1/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });



    // Doctor related api
    app.post("/api/v1/doctors", async (req, res) => {
      const data = req.body;
      const query = { email: data.email };
      const existingUser = await doctorCollection.findOne(query);
      if (existingUser) {
        return res.status(400).json({ error: "user already exist" });
      }
      const result = await doctorCollection.insertOne(data);
      res.send(result);
    });
    // ================
    app.get("/api/v1/doctors/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await doctorCollection.findOne(query);
      res.send(result);
    });
    // =============
    app.get("/api/v1/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });
    // =============

    app.delete("/api/v1/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctorCollection.deleteOne(query);
      res.send(result);
    });


// appointment related api
app.get("/api/v1/services",async (req, res) =>{
const result=await serviceCollection.find().toArray()
res.send(result)
})
// =============
app.post("/api/v1/appointments",async (req, res)=>{
  const data = req.body;
  const result = await appointmentCollection.insertOne(data);
  res.send(result);
})
// ==========
app.get("/api/v1/appointments/:email",async (req, res) =>{
  const email = req.params.email;
  const query = { email };
  const result=await appointmentCollection.find(query).toArray()
  res.send(result)
  })
  // =================
  app.delete("/api/v1/appointments/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await appointmentCollection.deleteOne(query);
    res.send(result);
  });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doc House is open now!");
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
