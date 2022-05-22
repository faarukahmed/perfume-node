const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const productCollection = client.db('genius').collection('product');
    const orderCollection = client.db('genius').collection('order')


    app.get('/product', async( req, res) =>{
      const query ={};
      const cursor = productCollection.find(query)
      const products = await cursor.toArray();
      res.send(products);
    })

    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.send(product);
    })


    // POST Add product
    app.post('/product', async(req, res) =>{
      const newproduct = req.body;
      const result = await productCollection.insertOne(newproduct);
      res.send(result)
    })

    // POST Delete 
    app.delete('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })


    app.get('/order', async(req, res) =>{
      const email = req.query.email;
      const query = {email};
      const cursor = orderCollection.find(query);
      const myitems = await cursor.toArray();
      res.send(myitems); 
    })

    app.delete('/order/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/order', async(req, res) =>{
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    })

    // Order Collection API
    app.post('/order', async( req, res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })


    // update quantity
    app.put('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const update = req.body;
      const filter ={_id: ObjectId(id)};
      const options = { upsert: true};
      const updatedDoc = {
        $set: {
          quantity: update.quantity
        }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options)
      res.send(result);
    })








  }
  finally{

  }
}
run().catch(console.dir)


app.get("/", (req, res) => {
  res.send("Running Perfume Server!");
});
app.get("/hero", (req, res) =>{
  res.send("Heroku Running")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
