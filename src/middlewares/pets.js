// TODO: оставить только промежуточную логику (запись в req). C данными работать только через модель

import { Router } from 'express';
import _ from 'lodash';
import reqUsers from './users_router';
import Pets from '../models/pets';

let pets = {};

function reqPets(req, res, next) {
  if (!pets) next('!pets');

  const typePet = req.query.type || req.query.havePet;
  if (typePet) {
    pets = pets.filter(pet => (pet.type === typePet));
    if (!pets) next('No pet type of ', typePet);
  }

  if (req.query.age_gt) {
    const age_gt = req.query.age_gt;
    pets = pets.filter(pet => (pet.age > age_gt));
    if (!pets) next('No pet older than ', age_gt);
  }

  if (req.query.age_lt) {
    const age_lt = req.query.age_lt;
    pets = pets.filter(pet => (pet.age < age_lt));
    if (!pets) next('No pet younger than ', age_lt);
  }
  req.pets = pets;
  next();
};

function reqPetById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id) next('!req.params.id');
  const pet = _.find(pets, obj => (obj.id === id));
  if (!pet) next('!req.pet');
  req.pet = pet;
  next();
}


function reqPetsByType(req, res, next) {
  const typePet = req.query.type || req.query.havePet;
  if (!typePet) next('!typePet');
  const petsByType = pets.filter(pet => (pet.type === typePet));
  if (!petsByType) next('!petsByType');
  req.petsByType = petsByType;
  next();
}

function populatePets(req, res, next) {
  const users = req.users;
  const populatedPets = pets.map((pet) => {
    const user = _.find(users, currentUser => (currentUser.id === pet.userId));
    return { ...pet, user };
  });
  if (!populatedPets) next('!populatedPets');
  res.json(populatedPets);
}

function populatePet(req, res, next) {
  const pet = req.pet;
  const users = req.users;
  const user = _.find(users, currentUser => (currentUser.id === pet.userId));
  if (!user) next('!user');
  res.json({ ...pet, user });
}

export default (petsData) => {
  pets = petsData;
  return petsRouter;
};
