import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import config from './config';
import _ from 'lodash';

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

const logParams = (req, res, next) => {
  console.log(req.params);
  next();
};

const rootReq = (req, res, next) => {
  res.json(petsData);
};

const reqUsers = (req, res, next) => {
  const users = petsData.users;
  if (!users) next('!users');
  req.users = users;
  next();
};

const reqUserById = (req, res, next) => {
  const id = +req.params.id;
  if (!id) next('!id');
  const user = _.find(req.users, usr => (usr.id === id));
  if (!user) next('!user')
  req.user = user;
  next();
  // (req.user = req.users.filter(usr => (usr.id === id))) ? next() : next('!user');
};

const reqUserByName = (req, res, next) => {
  const username = req.params.username;
  if (!username) next('!username');
  const user = _.find(req.users, obj => (obj.username === username));
  if (!user) next('!user');
  req.user = user;
  next();
};

const reqPets = (req, res, next) => {
  const pets = petsData.pets;
  if (!pets) next('!pets');
  req.pets = pets;
  next();
};

const reqPetById = (req, res, next) => {
  const id = +req.params.id;
  if (!id) next('!req.params.id');
  const pets = req.pets;
  const pet = _.find(pets, obj => (obj.id === id));
  if (!pet) next('!req.pet');
  req.pet = pet;
  next();
};

const resPetsByUser = (req, res, next) => {
  const user = req.user;
  const pets = req.pets;
  const petsByUser = pets.filter(pet => (pet.userId === user.id));
  if (!petsByUser) next('!petsByUser');
  res.json(petsByUser);
};

const resPetsByType = (req, res, next) => {
  const pets = req.pets;
  const typePet = req.query.type || req.query.havePet;
  if (!typePet) next('!typePet');
  const petsByType = pets.filter(pet => (pet.type === typePet));
  if (!petsByType) next('!petsByType');
  req.petsByType = petsByType;
  next();
}

const resUsersHasPetType = (req, res, next) => {
  const users = req.users;
  const pets = req.pets;
  const petsByType = req.petsByType;
  const usersHasPetType = petsByType.map(pet => users.filter(user => (user.id === pet.userId)));
  if (!usersHasPetType) next('!usersHasPet');
  res.json(usersHasPetType);
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
const rootRouter = Router();
const usersRouter = Router();
const userIdRouter = Router({ mergeParams: true });
const petIdRouter = Router({ mergeParams: true });
const userNameRouter = Router({ mergeParams: true });
const petsRouter = Router();
const petsByUserRouter = Router({ mergeParams: true });
const usersHasPetTypeRouter = Router({ mergeParams: true });

rootRouter.use(catchErrors);

rootRouter.route('/')
  .get((req, res) => res.json(petsData));

rootRouter.use('/users', usersRouter, logParams);

usersRouter.use(reqUsers);

usersRouter.route('/')
  .get((req, res) => res.json(req.users));

usersRouter.use('/:id(\\d+)', userIdRouter);

userIdRouter.use(reqUserById);

userIdRouter.route('/')
  .get((req, res) => res.json(req.user));

userIdRouter.use('/pets', petsByUserRouter);

petsByUserRouter.use(reqPets);

petsByUserRouter.use('/', resPetsByUser);

usersRouter.use('/:username(\\w+)', userNameRouter);

userNameRouter.use(reqUserByName);

userNameRouter.route('/')
  .get((req, res) => res.json(req.user));

userNameRouter.use('/pets', petsByUserRouter);

usersRouter.use('/?havePet', usersHasPetTypeRouter);

usersHasPetTypeRouter.use(resUsersHasPetType);

usersHasPetTypeRouter.route('/')
  .get((req, res) => res.json());

rootRouter.use('/pets', petsRouter);

petsRouter.use(reqPets);

petsRouter.route('/')
  .get((req, res) => res.json(req.pets));

petsRouter.use('/:id(\\d+)', petIdRouter);

petIdRouter.use(reqPetById);

petIdRouter.route('/')
  .get((req, res) => res.json(req.pet));

petsByUserRouter.use(resPetsByUser);

petsByUserRouter.route('/')
  .get((req, res) => {
    res.json();
  });

// idRouter.route('/:id (\\d)')
//   .get((req, res) => {
//     const entity = (req.params.users || req.params.pets);
//     const id = +req.params.id;
//     res.json((petsData[entity]).filter(obj => (obj.id === id)));
//   });

// app.use(logParams);

app.use('/task3B', rootRouter);

app.listen(config.port, async () => {
  console.log(`Your app listening on port ${config.port}!`);
  petsData = await getJsonData(config.data.url);
});
