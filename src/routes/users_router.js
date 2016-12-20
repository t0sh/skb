import { Router } from 'express';
import { reqPets, reqPetsByType } from './pets_router';
import * as UsersMiddlewares from '../middlewares/users';
import Users from '../models/users';

const usersRouter = Router();
usersRouter.use(UsersMiddlewares.reqUsers);
usersRouter.route('/')
  .get((req, res, next) => {
    (req.query.havePet) ? next() :
      res.json(req.users);
  })
  .get(reqPets, UsersMiddlewares.reqUsersHavePetType, (req, res) => {
    res.json(req.users);
  });

const userIdRouter = Router({ mergeParams: true });
usersRouter.use('/:id(\\-?\\d+)', userIdRouter);
userIdRouter.use(UsersMiddlewares.reqUserById);
userIdRouter.get('/', (req, res) => res.json(req.user));

const usersPopulateRouter = Router();
usersRouter.use('/populate', usersPopulateRouter);
usersPopulateRouter.use(reqPets);
usersPopulateRouter.route('/')
  .get((req, res, next) => {
    (req.query.havePet) ? next() :
      res.json(req.users.populate(req.pets));
  })
  .get(
    UsersMiddlewares.reqPetsByType,
    UsersMiddlewares.reqUsersHavePetType,
    (req, res) =>
      res.json(req.users.populate(req.pets)),
  );

const userNameRouter = Router({ mergeParams: true });
usersRouter.use('/:username(\\w+)', userNameRouter);
userNameRouter.use(UsersMiddlewares.reqUserByName);
userNameRouter.get('/', (req, res) => res.json(req.user));

const userPopulateRouter = Router();
userIdRouter.use('/populate', userPopulateRouter);
userNameRouter.use('/populate', userPopulateRouter);
userPopulateRouter.get('/',
  reqPets,
  (req, res) =>
    res.json(req.users.populateOne(req.pets, req.user)),
);

const petsByUserRouter = Router();
userIdRouter.use('/pets', petsByUserRouter);
userNameRouter.use('/pets', petsByUserRouter);
petsByUserRouter.get('/',
  reqPets,
  (req, res) =>
    res.json(req.users.getPetsByUser(req.user, req.pets)),
  );

export default (petsData) => {
  UsersMiddlewares.reqUsers = UsersMiddlewares.default(petsData.users);
  // middlewares.reqPets = middlewares.default(petsData.pets);
  return usersRouter;
};
