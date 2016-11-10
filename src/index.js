import express from 'express';
import cors from 'cors';

import canonize from './canonize'

const app = express();
app.use(cors());

app.get('/canonize', (req, res) => {
  const str = req.query.username;
  console.log(str);
  const userName = canonize(str) || 'Invalid name';
  res.send(userName);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
