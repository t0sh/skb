// TODO: только логика users независемая. ошибки только users
import _ from 'lodash';
import Pets from './pets';

class Users {
  constructor(petsData) {
    return petsData.users;
  }
}

const getUserById = (id) => {
  if (!id) throw new Error('!id');
  const user = _.find(this, usr => (usr.id === id));
  if (!user) throw new Error('!user');
  return user;
};

const getUsersHavePetType = (petsType) => {
  const pets = Pets.getPetsByType(petsType);
  let usersHavePetType = pets.map(pet =>
    _.find(this, user => (user.id === pet.userId)));
  // if (!usersHavePetType) throw new Error('!usersHavePetType');
  usersHavePetType = _(usersHavePetType).sortBy(['id']).sortedUniq();
  return usersHavePetType;
}

const getUserByName = (username) => {
  // if (!username) next('!username');
  const user = _.find(this, obj => (obj.username === username));
  // if (!user) next('!user');
  return user;
};

const populateUsers = (pets) => {
  const usersPop = this.reduce((usersP, user) => {
    let newUser = _.clone(user);
    newUser.pets = pets.filter(pet => (user.id === pet.userId));
    if (newUser.pets.length > 0)
      usersP.push(newUser);
    return usersP;
  }, []);
  // if (!usersPop) next('!usersPop');
  return usersPop;
};

const populateUser = (pets, userId) => {
  let user = _.clone(getUserById(userId));
  user.pets = pets.filter(pet => (user.id === pet.userId));
  // if (user.pets.length === 0)
  //   next('user does not have pet');
  return user;
};
