import { Router } from 'express';
import getReqPets, { reqPetsByType } from '../middlewares/pets';
import * as UsersMiddlewares from '../middlewares/users';
import * as Users from '../models/users';

export default (petsData) => {
  const middlewares = {
    ...UsersMiddlewares,
    reqUsers: UsersMiddlewares.default(petsData.users),
    reqPets: getReqPets(petsData.pets),
    reqPetsByType,
  };

  const userPopulateRouter = Router()
    .get('/',
      middlewares.reqPets,
      (req, res) =>
        res.json(Users.populateOne(req.pets, req.user)),
    );

  const petsByUserRouter = Router()
    .get('/',
      middlewares.reqPets,
      (req, res) =>
        res.json(Users.getPetsByUser(req.user, req.pets)),
      );

  const userIdRouter = Router({ mergeParams: true })
    .use(middlewares.reqUserById)
    .get('/', (req, res) => res.json(req.user))
    .use('/pets', petsByUserRouter)
    .use('/populate', userPopulateRouter)
  ;

  const usersPopulateRouter = Router()
    .use(
      middlewares.reqPets,
      middlewares.reqPetsByType,
      middlewares.reqUsersHavePetType,
    )
    .get('/', (req, res) =>
      res.json(Users.populate(req.users, req.allPets)));

  const userNameRouter = Router({ mergeParams: true })
    .use(middlewares.reqUserByName)
    .get('/', (req, res) => res.json(req.user))
    .use('/pets', petsByUserRouter)
    .use('/populate', userPopulateRouter)
  ;

  const usersRouter = Router()
    .use(middlewares.reqUsers)
    .use('/:id(\\-?\\d+)', userIdRouter)
    .use('/populate', usersPopulateRouter)
    .use('/:username(\\w+)', userNameRouter)
    .get('/',
      (req, res, next) => {
        (req.query.havePet) ? next() :
        res.json(req.users);
      },
      middlewares.reqPets,
      middlewares.reqPetsByType,
      middlewares.reqUsersHavePetType,
      (req, res) => res.json(req.users))
  ;

  return usersRouter;
};
