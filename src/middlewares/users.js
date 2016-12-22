import {
  getOneById,
  getOneByName,
  filterHavePetType,
} from '../models/users';

export default (usersData) => (
 (req, res, next) => {
   try {
     req.users = usersData;
     next();
   } catch (err) {
     next(err);
   }
 }
);

export function reqUserById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) next('id is NaN');
    req.user = getOneById(req.users, id);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqUserByName(req, res, next) {
  const username = req.params.username;
  if (username) {
    try {
      req.user = getOneByName(req.users, username);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}

export function reqUsersHavePetType(req, res, next) {
  const havePet = req.query.havePet;
  if (havePet) {
    try {
      req.users = filterHavePetType(req.users, req.pets);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}
