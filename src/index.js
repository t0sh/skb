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

app.post('/data', (req, res) => {
  const data = req.body;
  console.log(data);
  return res.json({
    data,
  });

  // const data = {
  //   user: {
  //     name: 't0sh',
  //   },
  //   pets: [
  //     {
  //       name: 'Zildjian',
  //       type: 'cat',
  //     },
  //     {
  //       name: 'Doge',
  //       type: 'dog',
  //     },
  //   ],
  // };
  // saveDataInDb(data);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});

// const Pet = mongoose.model('Pet', {
//   type: String,
//   name: String
// });
//
// const kitty = new Pet({
//   type: 'cat',
//   name: 'Zildjian'
// });
//
// kitty.save()
//   .then(() => {
//     console.log('success');
//   })
//   .catch((err) => {
//     console.log('err', err);
//   });
