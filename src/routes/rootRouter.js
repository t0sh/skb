import { Router } from 'express';
import _ from 'lodash';
// import usersRouter from './users_router';
// import petsRouter from './pets_router';

let petsData = {};

function rootReq(req, res, next) {
  res.json(petsData);
}

function logParams(req, res, next) {
  console.log(req.params);
  next();
}

function reqPets(req, res, next) {
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

function reqPetsByType(req, res, next) {
  const pets = req.pets;
  const typePet = req.query.type || req.query.havePet;
  if (!typePet) next('!typePet');
  const petsByType = pets.filter(pet => (pet.type === typePet));
  if (!petsByType) next('!petsByType');
  req.petsByType = petsByType;
  next();
}

function reqUsers(req, res, next) {
  const users = petsData.users;
  if (!users) next('!users');
  req.users = users;
  next();
}

function reqUserById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const users = req.users;
  if (!id) next('!id');
  const user = _.find(users, usr => (usr.id === id));
  if (!user) next('!user');
  req.user = user;
  next();
}

function resUsersHasPetType(req, res, next) {
  const users = req.users;
  const pets = req.pets;
  let usersHasPetType = pets.map(pet =>
    _.find(users, user => (user.id === pet.userId)));
  if (!usersHasPetType) next('!usersHasPet');
  usersHasPetType = _(usersHasPetType).sortBy(['id']).sortedUniq();
  res.json(usersHasPetType);
}

function reqUserByName(req, res, next) {
  const username = req.params.username;
  if (!username) next('!username');
  const user = _.find(req.users, obj => (obj.username === username));
  if (!user) next('!user');
  req.user = user;
  next();
}

function reqPetById(req, res, next) {
  const id = +req.params.id;
  if (!id) next('!req.params.id');
  const pets = req.pets;
  const pet = _.find(pets, obj => (obj.id === id));
  if (!pet) next('!req.pet');
  req.pet = pet;
  next();
}

function resPetsByUser(req, res, next) {
  const user = req.user;
  const pets = req.pets;
  const petsByUser = pets.filter(pet => (pet.userId === user.id));
  if (!petsByUser) next('!petsByUser');
  res.json(petsByUser);
}

function populatePets(req, res, next) {
  const users = req.users;
  const pets = req.pets;
  const populatedPets = pets.map((pet) => {
    const user = _.find(users, currentUser => (currentUser.id === pet.userId));
    return { ...pet, user };
  });
  if (!populatedPets) next('!populatedPets');
  res.json(populatedPets);
}

function populatePet(req, res, next) {
  const pet = req.pet;
  const users = req.users;
  const user = _.find(users, currentUser => (currentUser.id === pet.userId));
  if (!user) next('!user');
  res.json({ ...pet, user });
}

function populateUsers(req, res, next) {
  const users = req.users;
  // const allPets = req.pets;
  const allPets = petsData.pets; // чит! надо передовать по цепочке req
  const populatedUsers = users.reduce((resultUsers, currentUser) => {
    const pets = allPets.filter(pet => (currentUser.id === pet.userId));
    if (!pets.isEmpty) {
      resultUsers.push({ ...currentUser, pets });
    }
    return resultUsers;
  }, []);
  if (!populatedUsers) next('!usersPop');
  req.populatedUsers = populatedUsers;
  next();
}

function populateUsersHavePetType(req, res, next) {
  const populatedUsers = req.populatedUsers;
  const petType = req.query.havePet;
  const populatedUsersHavePetType =
    populatedUsers.filter(user => (user.pets.some(pet => (pet.type === petType))));
  if (!populatedUsersHavePetType) next('!usersPop');
  res.json(populatedUsersHavePetType);
}

function populateUser(req, res, next) {
  const allPets = req.pets;
  const user = req.user;
  const pets = allPets.filter(pet => (user.id === pet.userId));
  if (pets.isEmpty) next('user does not have pet');
  res.json({ ...user, pets });
}
// function reqPetsByType(req, res, next) {
//   const pets = req.pets;
//   console.log('test');
//   const typePet = req.query.type || req.query.havePet;
//   if (!typePet) next('!typePet');
//   const petsByType = pets.filter(pet => (pet.type === typePet));
//   if (!petsByType) next('!petsByType');
//   req.petsByType = petsByType;
//   next();
// }

// function resUsersHasPetType(req, res, next) {
//   const users = req.users;
//   const pets = req.pets;
//   const petsByType = req.petsByType;
//   const usersHasPetType = petsByType.map(pet => _.find(users, user => (user.id === pet.userId)));
//   if (!usersHasPetType) next('!usersHasPet');
//   res.json(usersHasPetType);
// }
//
// function resPetsAgeMoreThen(req, res, next) {
//   const pets = req.pets;
//   const age_gt = +req.query.age_gt;
//   const petsAgeMoreThen = pets.filter(pet => (pet.age > age_gt));
//   if (!petsAgeMoreThen) next('!petsAgeMoreThen');
//   res.json(petsAgeMoreThen);
// }
//
// function resPetsAgeLessThen(req, res, next) {
//   const pets = req.pets;
//   const age_lt = +req.query.age_lt;
//   const petsAgeLessThen = pets.filter(pet => (pet.age < age_lt));
//   if (!petsAgeLessThen) next('!petsAgeLessThen');
//   res.json(petsAgeLessThen);
// }

const rootRouter = Router();
rootRouter.get('/', (req, res) => res.json(petsData));

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
userIdRouter.get('/', (req, res) => res.json(req.user));

const usersPopulateRouter = Router();
usersRouter.use('/populate', usersPopulateRouter);
usersPopulateRouter.use(reqPets, populateUsers);
usersPopulateRouter.route('/')
  .get((req, res, next) => {
    (req.query.havePet) ? next() :
      res.json(req.populatedUsers);
  })
  .get(populateUsersHavePetType);

const userNameRouter = Router({ mergeParams: true });
usersRouter.use('/:username(\\w+)', userNameRouter);
userNameRouter.use(reqUserByName);
userNameRouter.get('/', (req, res) => res.json(req.user));

const userPopulateRouter = Router();
userIdRouter.use('/populate', userPopulateRouter);
userNameRouter.use('/populate', userPopulateRouter);
userPopulateRouter.get('/', reqPets, populateUser);

const petsByUserRouter = Router();
userIdRouter.use('/pets', petsByUserRouter);
userNameRouter.use('/pets', petsByUserRouter);
petsByUserRouter.get('/', reqPets, resPetsByUser);

const petsRouter = Router();
rootRouter.use('/pets', petsRouter);
petsRouter.use(reqPets);
petsRouter.get('/', (req, res) => res.json(req.pets));

const petIdRouter = Router({ mergeParams: true });
petsRouter.use('/:id(\\-?\\d+)', petIdRouter);
petIdRouter.use(reqPetById);
petIdRouter.get('/', (req, res) => res.json(req.pet));

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

const petsPopulateRouter = Router();
petsRouter.use('/populate', petsPopulateRouter);
petsPopulateRouter.get('/', reqUsers, populatePets);

const petPopulateRouter = Router();
petIdRouter.use('/populate', petPopulateRouter);
petPopulateRouter.get('/', reqUsers, populatePet);

export default (data) => {
  petsData = data;
  return rootRouter;
};
