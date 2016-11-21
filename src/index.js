import express from 'express';
import cors from 'cors';
import getColor from './getColor';

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});

app.set('query parser', 'simple'); // utf-8 encoding

app.get('/task2D', (req, res) => {
  console.log(req.query.color);
  const color = (req.query.color || '').toLowerCase().replace(/\s/g, '').replace(/%[0-9]{2}/g, '');
  const response = getColor(color);
  res.send(response);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
