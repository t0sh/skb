import express from 'express';
import cors from 'cors';

import Promise from 'bluebird';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function getPC(pcUrl) {
  try {
    const response = await fetch(pcUrl);
    const pc = await response.json();
    return pc;
  } catch (err) {
    console.log('Чтото пошло не так:', err);
    return response.json({ err });
  }
}

const pcUrl =
  'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

app.get('/task3A/volumes', async (req, res) => {
  let result = await getPC(pcUrl);
  const outputArray = _(result.hdd)
    .groupBy('volume')
    .map((size, volume) => ({
      // [volume]: _.sumBy(size, 'size'), // todo
      volume,
      size: _.sumBy(size, 'size').toString() + "B",
    }))
    .value();

  const obj = _.fromPairs(_.map(outputArray, i => [i.volume, i.size]));
  console.log(obj);
  res.json(obj);
});

app.get('/task3A/:field1?/:field2?/:field3?', async (req, res) => {
  let result = await getPC(pcUrl);
  console.log(req.originalUrl);
  let i = 0;
  _(req.params)
    .forEach((field) => {
      if (field && result) {
        result = result[`${field}`];
      }
  });
  (result !== '' && result !== undefined) ?
    res.json(result) :
    res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
