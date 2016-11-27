import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import config from './config';

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

let petsData = {};  // ))

const rootReq = (req, res, next) => {
  res.json(petsData);
};

const logParams = (req, res, next) => {
  console.log(req.params);
  next();
};

const reqUsers = (req, res, next) => {
  req.users = petsData.users;
  next();
};

const reqUserById = (req, res, next) => {
  const id = +req.params.id;
  if (!id) next('!req.params.id');
  req.user = req.users.filter(user => (user.id === id));
  if (!req.user) next('!req.user')
  next();
};

const reqUserByName = (req, res, next) => {
  const username = req.params.username;
  if (!req.params.username) next('!req.params.username');
  req.user = req.users.filter(obj => (obj.username === username));
  if (!req.user) next('!req.user');
  next();
};

const reqPets = (req, res, next) => {
  req.pets = petsData.pets;
  if (!req.pets) next('!req.pets');
  next();
};

const reqPetById = (req, res, next) => {
  const id = +req.params.id;
  req.pet = req.pet.filter(obj => (obj.id === id));
  if (!req.pet) next('!req.pet');
  next();
};

const resUserPets = (req, res, next) => {
  const user = req.user;
  const pets = req.pets;
  const userPets = pets.filter(pet => (pet.userId === user.id));
  if (!userPets) next('!userPets');
  res.json(userPets);
};

const reqPetsType = (req, res, next) => {
  const pets = req.pets;
  const typePet = req.query.type || req.query.havePet;
  if (!typePet) next('!typePet');
  const petsType = pets.filter(pet => (pet.type === typePet));
  if (!petsType) next('!petsType');
  req.petsType = petsType;
  next();
}

const resUsersHasPet = (req, res, next) => {
  const users = req.users;
  const pets = req.pets;
  const petsType = req.petsType;
  const usersHasPet = petsType.map(pet => users.filter(user => (user.id === pet.userId)));
  if (!usersHasPet) next('!usersHasPet');
  res.json(usersHasPet);
}

const resPetsAgeMoreThen = (req, res, next) => {
  const pets = req.pets;
  const age_gt = +req.query.age_gt;
  const petsAgeMoreThen = pets.filter(pet => (pet.age > age_gt));
  if (!petsAgeMoreThen) next('!petsAgeMoreThen');
  res.json(petsAgeMoreThen);
};

const resPetsAgeLessThen = (req, res, next) => {
  const pets = req.pets;
  const age_lt = +req.query.age_lt;
  const petsAgeLessThen = pets.filter(pet => (pet.age < age_lt));
  if (!petsAgeLessThen) next('!petsAgeLessThen');
  res.json(petsAgeLessThen);
}

const catchErrors = (err, req, res, next) => {
  res.status(404).send('Not Found');
}

// const entityRouter = express.Router();
const rootRouter = express.Router();
const idRouter = express.Router({ mergeParams: true });

const usersRouter = express.Router();

const petsByIdUserRouter = express.Router();
const petsRouter = express.Router();

rootRouter.use(rootReq, catchErrors);

usersRouter.route('/'
  .get((req, res) => {
    res.json(req.users);
  });

usersRouter.use(reqUsers, catchErrors);

usersRouter.route('/users')
  .get((req, res) => {
    res.json(req.users);
  });

usersRouter.use('/users/:id(\\d)', idRouter); // передаем параметр вниз в idRouter

idRouter.use(reqUserById);

idRouter.route('/')
  .get((req, res) => {
    res.json(req.user);
  });

idRouter.use('/pets', petsByIdUserRouter);

petsByIdUserRouter.use(resUserPets);

petsByIdUserRouter.route('/')
  .get((req, res) => {
    res.json();
  });
//
// petsRouter.route('/pets')
//   .get((req, res) => {
//     res.json(petsData.pets);
//   });
//
// petsRouter.use('/:pets', idRouter);

// idRouter.route('/:id (\\d)')
//   .get((req, res) => {
//     const entity = (req.params.users || req.params.pets);
//     const id = +req.params.id;
//     res.json((petsData[entity]).filter(obj => (obj.id === id)));
//   });

// idRouter.route('/:username(\\w+)')
//   .get((req, res) => {
//     const username = req.params.username;
//     res.json((petsData.users).filter(obj => (obj.username === username)));
//   });
//
// const userPetsRouter = express.Router();
//
// userPetsRouter.route('/:param(id|username)')
//   .get((req, res) => {
//     const username = req.params.username;
//     res.json((petsData.users).filter(obj => (obj.username === username)));
//   });
//
// idRouter.use('/:pets', idRouter);

const logParamsRouter = express.Router();



app.use(logParams);

app.use('/task3B', rootReq, usersRouter, petsRouter); // entityRouter,

app.listen(config.port, async () => {
  console.log(`Your app listening on port ${config.port}!`);
  petsData = await getJsonData(config.data.url);
});
