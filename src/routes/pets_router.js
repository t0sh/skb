import { Router } from 'express';
import * as PetsMiddlewares from '../middlewares/pets';
import getReqUsers from '../middlewares/users';
import * as Pets from '../models/pets';

export default (petsData) => {
  const middlewares = {
    ...PetsMiddlewares,
    reqPets: PetsMiddlewares.default(petsData.pets),
    reqUsers: getReqUsers(petsData.users),
  };

  const petPopulateRouter = Router()
    .get('/',
      middlewares.reqUsers,
      (req, res) =>
        res.json(Pets.populateOne(req.pet, req.users)))
  ;

  const petIdRouter = Router({ mergeParams: true })
    .use(middlewares.reqPetById)
    .get('/', (req, res) => res.json(req.pet))
    .use('/populate', petPopulateRouter)
  ;

  const petsPopulateRouter = Router()
    .get('/',
      middlewares.reqUsers,
      (req, res) => res.json(Pets.populate(req.pets, req.users)))
  ;

  const petsRouter = Router()
    .use(
      middlewares.reqPets,
      middlewares.reqPetsByType,
      middlewares.reqPetsAgeMoreThen,
      middlewares.reqPetsAgeLessThen,
    )
    .get('/', (req, res) => res.json(req.pets))
    .use('/:id(\\-?\\d+)', petIdRouter)
    .use('/populate', petsPopulateRouter)
  ;

  return petsRouter;
};
