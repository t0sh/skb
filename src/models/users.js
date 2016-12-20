import _ from 'lodash';
import Pets from './pets';

export default class Users {
  constructor(petsData) {
    const users = petsData.users;
    if (!users) throw new Error('!users')
    return users;
  }

  getOneById(id) {
    const user = _.find(this, usr => (usr.id === id));
    if (!user) throw new Error('!user');
    return user;
  }

  getOneByName(username) {
    const user = _.find(this, obj => (obj.username === username));
    if (!user) throw new Error('!user');
    return user;
  }

  static getPetsByUser(user, pets) {
    const petsByUser = pets.filter(pet => pet.userId === user.id);
    if (!petsByUser) throw new Error('!petsByUser');
    return petsByUser;
  }

  filterHavePetType(petsByType) {
    const usersHavePetType = petsByType.map(pet =>
      _.find(this, user => (user.id === pet.userId)));
    if (!usersHavePetType) throw new Error('!usersHavePetType');
    return _(usersHavePetType).sortBy(['id']).sortedUniq();
  }

  static _populate(pets, users) {
    const populatedUsers = users.reduce((resultUsers, currentUser) => {
      const userPets = pets.filter(pet => (currentUser.id === pet.userId));
      if (!userPets.isEmpty) {
        resultUsers.push({ ...currentUser, pets: userPets });
      }
      return resultUsers;
    }, []);
    if (!populatedUsers) throw new Error('!populatedUsers');
    return populatedUsers;
  }
  populate(pets) {
    const populatedUsers = this._populate(pets, this);
    return populatedUsers;
  }

  static populateOne(pets, user) {
    const userPets = pets.filter(pet => (user.id === pet.userId));
    if (pets.isEmpty) throw new Error('user does not have pet');
    return { ...user, pets: userPets };
  }

  populateHavePetType(pets, usersHavePetType) {
    const populatedUsersHavePetType = this._populate(pets, usersHavePetType);
    return populatedUsersHavePetType;
  }
}
