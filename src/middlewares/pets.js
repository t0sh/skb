import * as Pets from '../models/pets';

export default (petsData) => (
  (req, res, next) => {
    try {
      req.allPets = petsData;
      req.pets = req.allPets;
      next();
    } catch (err) {
      next(err);
    }
  }
);

export function reqPetsByType(req, res, next) {
  const typePet = req.query.type || req.query.havePet;
  if (typePet) {
    try {
      req.pets = Pets.filterByType(req.pets, typePet);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}

export function reqPetsAgeMoreThen(req, res, next) {
  const age_gt = req.query.age_gt;
  if (age_gt) {
    try {
      req.pets = Pets.filterAgeMoreThen(req.pets, age_gt);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}

export function reqPetsAgeLessThen(req, res, next) {
  const age_lt = req.query.age_lt;
  if (age_lt) {
    try {
      req.pets = Pets.filterAgeLessThen(req.pets, age_lt);
      next();
    } catch (err) {
      next(err);
    }
  } else next();
}

export function reqPetById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) next('id is NaN');
    req.pet = Pets.getOneById(req.pets, id);
    next();
  } catch (err) {
    next(err);
  }
}
