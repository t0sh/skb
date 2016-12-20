import Users from '../models/users';

export default (usersData) => (
  (req, res, next) => {
    try {
      req.users = new Users(usersData);
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
    req.user = req.users.getOneById(id);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqUserByName(req, res, next) {
  const username = req.params.username;
  if (username) {
    try {
      req.user = users.getOneByName(username);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}

export function reqUsersHavePetType(req, res, next) {
  try {
    req.users = req.users.filterHavePetType(req.petsByType);
    next();
  } catch (err) {
    next(err);
  }
}

export function populateUsers(req, res, next) {
  try {
    const populatedUsers = req.users.populate(req.pets);
    res.json(populatedUsers); // не мидлвара
  } catch (err) {
    next(err);
  }
}

export function populateUser(req, res, next) {
  try {
    const populatedUser = req.users.populateOne(req.pets, req.user);
    res.json(populatedUser);
  } catch (err) {
    next(err);
  }
}
