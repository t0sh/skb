import Users from '../models/users';

let users;

export function reqUsers(req, res, next) {
  try {
    req.users = new Users(users);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqUserById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id) next('!id');
  try {
    req.user = req.users.getOneById(id);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqUsersHavePetType(req, res, next) {
  const petType = req.query.havePet;
  if (!petType) next('!petType');
  try {
    req.usersHavePetType = req.users.filterHavePetType(req.petsByType);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqUserByName(req, res, next) {
  const username = req.params.username;
  if (!username) next('!username');
  try {
    req.user = users.getOneByName(username);
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

export function populateUsersHavePetType(req, res, next) {
  try {
    const populatedUsersHavePetType = req.users.populateHavePetType(
      req.pets,
      req.usersHavePetType
    );
    res.json(populatedUsersHavePetType); // не мидлвара
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

export default (usersData) => {
  users = usersData;
};
