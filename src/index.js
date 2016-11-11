import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import bodyParser from 'body-parser';
import saveDataInDb from './saveDataInDb';
import Pet from './models/Pet';
import User from './models/User';

mongoose.Promise = Promise;
mongoose.connect('mongodb://publicdb.mgbeta.ru/t0sh_skb3');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

app.get('/pets', async (req, res) => {
  const pets = await Pet.find().populate('owner');
  return res.json(pets);
});

app.post('/data', async (req, res) => {
  const data = req.body;
  if (!data.user) return res.status(400).send('user required');
  if (!data.pets) data.pets = [];
  try {
    const result = await saveDataInDb(data);
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
