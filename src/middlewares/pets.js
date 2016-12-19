import Pets from '../models/pets';

let pets = {};

export function reqPets(req, res, next) {
  try {
    req.pets = new Pets(pets);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqPetsByType(req, res, next) {
  const typePet = req.query.type || req.query.havePet;
  if (!typePet) next('!typePet');
  try {
    req.petsByType = req.pets.filterByType(typePet);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqPetsAgeMoreThen(req, res, next) {
  const age_gt = req.query.age_gt;
  if (!age_gt) next('!age_gt');
  try {
    req.pets = req.pets.filterAgeMoreThen(age_gt);
    next();
  } catch (err) {
    next(err);
  }
}

export function reqPetsAgeLessThen(req, res, next) {
  const age_lt = req.query.age_lt;
  if (!age_lt) next('!age_lt');
  try {
    req.pets = req.pets.filterAgeLessThen(age_lt);
    next();
  } catch (err) {
    next(err);
  }
};

export function reqPetById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id) next('!req.params.id');
  try {
    req.pet = req.pets.getOneById(id);
    next();
  } catch (err) {
    next(err);
  }
}

function populatePets(req, res, next) {
  try {
    const populatedPets = req.pets.populate(req.users);
    res.json(populatedPets); // не мидлвара
  } catch (err) {
    next(err)
  }
}

function populatePet(req, res, next) {
  try {
    const populatedPet = req.pets.populateOne(req.users, req.pet);
    res.json(populatedPet); // не мидлвара
  } catch (err) {
    next(err);
  }
}

export default (petsData) => {
  pets = petsData;
};
