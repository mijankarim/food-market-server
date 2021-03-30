const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
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

  app.get("/products", (req, res) => {
     productsCollection.find()
     .toArray((err, products) => {
         res.send( products)
     }) 
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log("adding new product:", newProduct);
    productsCollection.insertOne(newProduct).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port);
