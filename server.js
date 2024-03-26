const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hi99b4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/get-expenses', async (req, res) => {
  const {initDate, endDate} = req.query;

  try {
    await client.connect();
    const database = client.db('finance-data');
    const collection = database.collection('expenses');
    const cursor = collection.find({
      date: {
        $gte: +initDate,
        $lte: +endDate,
      },
    });

    const data = await cursor.toArray();
    res.send(data);
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout( async () => await client.close(), 5000);
  }
});

app.get('/get-filters', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('user-data');
    const collection = database.collection('expenses-props');

    const data =await collection.findOne({});
    res.send(data);
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout( async () => await client.close(), 5000);
  }
});

app.post('/add-entry', async (req, res)=>{
  try {
    const data = req.body;

    await client.connect();
    const database = client.db('finance-data');
    const collection = database.collection('expenses');
    await collection.insertOne(data);

    res.status(200).send('New entry added');
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout( async () => await client.close(), 5000);
  }
});

app.post('/add-exp-prop', async (req, res)=>{
  try {
    const {key, array} = req.body;

    await client.connect();
    const database = client.db('user-data');
    const collection = database.collection('expenses-props');
    const update = {$set: {[key]: array}};
    await collection.updateOne({}, update);

    res.status(200).send('New option added');
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout( async () => await client.close(), 5000);
  }
});

app.listen('3000', () => console.log('Server is running'));
