const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World Server site");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbpdo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("foodMarket").collection("products");
  const ordersCollection = client.db("foodMarket").collection("orders");

  app.get("/products", (req, res) => {
     productsCollection.find()
     .toArray((err, products) => {
         res.send( products)
     }) 
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/orders', (req,res) => {
    ordersCollection.find({email: req.query.email })
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req,res) => {
    console.log(req.params.id)
    productsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result.deletedCount)
    })
  })


});

app.listen(port);
