// TODO: В запросе users/populate?havePet=cat у юзеров приходят только коты, а должны приходить все животные, которые есть у держателей котов.

import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
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

const logParams = (req, res, next) => {
  console.log(req.params);
  next();
};

const rootReq = (req, res, next) => {
  res.json(petsData);
};

const reqPets = (req, res, next) => {
  let pets = petsData.pets;
  if (!pets) next('!pets');

  const typePet = req.query.type || req.query.havePet;
  if (typePet) {
    pets = pets.filter(pet => (pet.type === typePet));
    if (!pets) next('No pet type of ', typePet);
  }

  if (req.query.age_gt) {
    const age_gt = req.query.age_gt;
    pets = pets.filter(pet => (pet.age > age_gt));
    if (!pets) next('No pet older than ', age_gt);
  }

  if (req.query.age_lt) {
    const age_lt = req.query.age_lt;
    pets = pets.filter(pet => (pet.age < age_lt));
    if (!pets) next('No pet younger than ', age_lt);
  }
  req.pets = pets;

  next();
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
  if (!user) next('!user');
  req.user = user;
  next();
  // (req.user = req.users.filter(usr => (usr.id === id))) ? next() : next('!user');
};

const resUsersHasPetType = (req, res, next) => {
  const users = req.users;
  const pets = req.pets;
  let usersHasPetType = pets.map(pet =>
    _.find(users, user => (user.id === pet.userId)));
  if (!usersHasPetType) next('!usersHasPet');
  usersHasPetType = _(usersHasPetType).sortBy(['id']).sortedUniq();
  res.json(usersHasPetType);
}

const reqUserByName = (req, res, next) => {
  const username = req.params.username;
  if (!username) next('!username');
  const user = _.find(req.users, obj => (obj.username === username));
  if (!user) next('!user');
  req.user = user;
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

const petsPopulate = (req, res, next) => {
  const users = req.users;
  const pets = req.pets;
  const petsPop = pets.map((pet) => {
    let newPet = _.clone(pet);
    newPet['user'] = _.find(users, user => (user.id === pet.userId));
    return newPet;
  });
  if (!petsPop) next('!petsPop');
  res.json(petsPop);
};

const petPopulate = (req, res, next) => {
  const users = req.users;
  let pet = _.clone(req.pet);
  const user = _.find(users, user => (user.id === pet.userId));
  if (!user) next('!user');
  pet.user = user;
  res.json(pet);
};

const usersPopulate = (req, res, next) => {
  const users = req.users;
  const pets = req.pets;
  const usersPop = users.reduce((usersP, user) => {
    let newUser = _.clone(user);
    newUser['pets'] = pets.filter(pet => (user.id === pet.userId));
    if (newUser.pets.length > 0)
      usersP.push(newUser);
    return usersP;
  }, []);

  if (!usersPop) next('!usersPop');
  res.json(usersPop);
};

const userPopulate = (req, res, next) => {
  let user = _.clone(req.user);
  let pets = req.pets;
  user.pets = pets.filter(pet => (user.id === pet.userId));
  if (user.pets.length === 0)
    next('user does not have pet');
  res.json(user);
};
// const reqPetsByType = (req, res, next) => {
//   const pets = req.pets;
//   console.log('test');
//   const typePet = req.query.type || req.query.havePet;
//   if (!typePet) next('!typePet');
//   const petsByType = pets.filter(pet => (pet.type === typePet));
//   if (!petsByType) next('!petsByType');
//   req.petsByType = petsByType;
//   next();
// }

// const resUsersHasPetType = (req, res, next) => {
//   const users = req.users;
//   const pets = req.pets;
//   const petsByType = req.petsByType;
//   const usersHasPetType = petsByType.map(pet => _.find(users, user => (user.id === pet.userId)));
//   if (!usersHasPetType) next('!usersHasPet');
//   res.json(usersHasPetType);
// }
//
// const resPetsAgeMoreThen = (req, res, next) => {
//   const pets = req.pets;
//   const age_gt = +req.query.age_gt;
//   const petsAgeMoreThen = pets.filter(pet => (pet.age > age_gt));
//   if (!petsAgeMoreThen) next('!petsAgeMoreThen');
//   res.json(petsAgeMoreThen);
// };
//
// const resPetsAgeLessThen = (req, res, next) => {
//   const pets = req.pets;
//   const age_lt = +req.query.age_lt;
//   const petsAgeLessThen = pets.filter(pet => (pet.age < age_lt));
//   if (!petsAgeLessThen) next('!petsAgeLessThen');
//   res.json(petsAgeLessThen);
// }

const catchErrors = (err, req, res, next) => {
  res.status(404).send('Not Found');
}

const rootRouter = Router();
rootRouter.use(catchErrors);
rootRouter.route('/')
  .get((req, res) => res.json(petsData));

const usersRouter = Router();
rootRouter.use('/users', usersRouter);
usersRouter.use(reqUsers);
usersRouter.route('/')
  .get((req, res, next) => {
    (req.query.havePet) ? next() :
      res.json(req.users);
  })
  .get(reqPets, resUsersHasPetType);


const userIdRouter = Router({ mergeParams: true });
usersRouter.use('/:id(\\-?\\d+)', userIdRouter);
userIdRouter.use(reqUserById);
userIdRouter.route('/')
  .get((req, res) => res.json(req.user));

const usersPopulateRouter = Router();
usersRouter.use('/populate', usersPopulateRouter);
usersPopulateRouter.get('/', reqPets, usersPopulate);

const userNameRouter = Router({ mergeParams: true });
usersRouter.use('/:username(\\w+)', userNameRouter);
userNameRouter.use(reqUserByName);
userNameRouter.route('/')
  .get((req, res) => res.json(req.user));

const petsByUserRouter = Router();
userIdRouter.use('/pets', petsByUserRouter);
userNameRouter.use('/pets', petsByUserRouter);
petsByUserRouter.get('/', reqPets, resPetsByUser);

const petsRouter = Router();
rootRouter.use('/pets', petsRouter);
petsRouter.use(reqPets);
petsRouter.route('/')
  .get((req, res) => res.json(req.pets));

const petIdRouter = Router({ mergeParams: true });
petsRouter.use('/:id(\\-?\\d+)', petIdRouter);
petIdRouter.use(reqPetById);
petIdRouter.route('/')
  .get((req, res) => res.json(req.pet));

// const petsByTypeRouter = Router();
// petsRouter.use('/?type', petsByTypeRouter);
// petsByTypeRouter.get('/', reqPetsByType);

// const petsAgeMoreThenRouter = Router();
// petsRouter.use('/?age_gt', petsAgeMoreThenRouter);
// petsAgeMoreThenRouter.get('/', resUsersHasPetType);
//
// const petsAgeLessThenRouter = Router();
// petsRouter.use('/?age_lt', petsAgeLessThenRouter);
// petsAgeLessThenRouter.get('/', resPetsAgeLessThen);

// idRouter.route('/:id (\\d)')
//   .get((req, res) => {
//     const entity = (req.params.users || req.params.pets);
//     const id = +req.params.id;
//     res.json((petsData[entity]).filter(obj => (obj.id === id)));
//   });

// app.use(logParams);

const petsPopulateRouter = Router();
petsRouter.use('/populate', petsPopulateRouter);
petsPopulateRouter.get('/', reqUsers, petsPopulate);

const petPopulateRouter = Router();
petIdRouter.use('/populate', petPopulateRouter);
petPopulateRouter.get('/', reqUsers, petPopulate);


app.use('/task3B', rootRouter, catchErrors);

app.listen(config.port, async () => {
  console.log(`Your app listening on port ${config.port}!`);
  petsData = await getJsonData(config.data.url);
});
