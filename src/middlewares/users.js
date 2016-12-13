
export function reqUsers(req, res, next) {
  if (!users) next('!users');
  req.users = users;
  next();
}

function reqUserById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id) next('!id');
  const user = _.find(users, usr => (usr.id === id));
  if (!user) next('!user');
  req.user = user;
  next();
}

function resUsersHasPetType(req, res, next) {
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

function populateUsers(req, res, next) {
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
