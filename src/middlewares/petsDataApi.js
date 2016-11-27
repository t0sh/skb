function reqUsers(req, res, next) {
  req.users = petsData.users;
  next();
};

function reqUserById(req, res, next) {
  const id = +req.params.id;
  req.user = req.users.filter(obj => (obj.id === id));
  if (!req.user)
    next('!req.user')
  next();
};

function reqUserByName(req, res, next) {
  const id = +req.params.id;
  req.user = req.users.filter(obj => (obj.username === username));
  next();
};

function reqPets(req, res, next) {
  req.pets = petsData.pets;
  if (!req.pets)
    next('!req.pets');
};

function reqPetById(req, res, next) {
  const id = +req.params.id;
  req.pet = req.pet.filter(obj => (obj.id === id));
  if (!req.pet)
    next('!req.pet');
};

function catchErrorsv(err, req, res, next) {
  res.json({ err });
};
