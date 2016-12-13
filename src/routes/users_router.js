import { Router } from 'express';
import _ from 'lodash';
import reqPets from './pets_router';

let users = {};

const usersRouter = Router();
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


export default (usersData) => {
  users = usersData;
  return usersRouter;
};
