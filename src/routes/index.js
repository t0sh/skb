import { Router } from 'express';
import usersRouter from './users_router';
import petsRouter from './pets_router';

function reqPathLog(req, res, next) {
  console.log(req.originalUrl);
  next();
}

export default (petsData) => {
  const rootRouter = Router()
    .use(reqPathLog)
    .get('/', (req, res) => res.json(petsData))
    .use('/pets', petsRouter(petsData))
    .use('/users', usersRouter(petsData))
  ;
  return rootRouter;
};
