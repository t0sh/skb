import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';

import config from './config';
import rootRouter from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function getJsonData(dataUrl) {
  let response;
  try {
    response = await fetch(dataUrl);
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    console.log('Чтото пошло не так:', err);
    return response.json({ err });
  }
}

function catchErrors(err, req, res, next) {
  console.log(err.message);
  res.status(404).send('Not Found');
}

(async function init() {
  try {
    console.log('Geting JSON...');
    const petsData = await getJsonData(config.data.url);
    app.use('/task3B', rootRouter(petsData), catchErrors);
    console.log('Starting WEB server...');
    await app.listen(config.port);
    console.log(`Server was started on ${config.port} port`);
  } catch (err) {
      console.error(err);
  }
})();
