const express = require('express');
const cors = require('cors');
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

    res.send(await cursor.toArray());
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.get('/get-filters', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('user-data');
    const collection = database.collection('expenses-props');

    res.send(await collection.findOne({}));
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.listen('3000', () => console.log('Server is running'));
