import _ from 'lodash';

export function getOneById(users, id) {
  const user = users.find(usr => (usr.id === id));
  if (!user) throw new Error(`!user id=${id}`);
  return user;
}

export function getOneByName(users, username) {
  const user = users.find(usr => (usr.username === username));
  if (!user) throw new Error(`!user name ${username}`);
  return user;
}

export function getPetsByUser(user, pets) {
  const petsByUser = pets.filter(pet => pet.userId === user.id);
  if (!petsByUser) throw new Error(`!pets by user ${user.username}`);
  return petsByUser;
}

export function filterHavePetType(users, petsByType) {
  const usersHavePetType = petsByType.map(pet =>
    users.find(user => (user.id === pet.userId)));
  if (!usersHavePetType) throw new Error('!users have such pet type');
  return _(usersHavePetType).sortBy(['id']).sortedUniq();
}

export function populate(users, pets) {
  const populatedUsers = users.reduce((resultUsers, user) => {
    const petsByUser = getPetsByUser(user, pets);
    if (!petsByUser.isEmpty) {
      resultUsers.push({ ...user, pets: petsByUser });
    }
    return resultUsers;
  }, []);
  if (!populatedUsers) throw new Error('!populated users');
  return populatedUsers;
}

export function populateOne(pets, user) {
  const userPets = getPetsByUser(user, pets);
  if (userPets.isEmpty) throw new Error(`user ${user.username} does not have pet`);
  return { ...user, pets: userPets };
}
