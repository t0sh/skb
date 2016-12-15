// TODO: только логика users независемая. ошибки только users
import _ from 'lodash';
import Pets from './pets';

export default class Users {
  constructor(petsData) {
    return petsData.users;
  }

	getOneById(id) {
	  if (!id) throw new Error('!id');
	  const user = _.find(this, usr => (usr.id === id));
	  if (!user) throw new Error('!user');
	  return user;
	}

	filterHavePetType(petsType) {
		const pets = Pets.filterByType(petsType);
		const usersHavePetType = pets.map(pet =>
			_.find(this, user => (user.id === pet.userId)));
	  if (!usersHavePetType) throw new Error('!usersHavePetType');
		return _(usersHavePetType).sortBy(['id']).sortedUniq();
	}

	getOneByName(username) {
	  if (!username) throw new Error('!username');
	  const user = _.find(this, obj => (obj.username === username));
	  if (!user) throw new Error('!user');
	  return user;
	}

	static populate(pets, users) {
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
		const populatedUsers = this.populate(pets, this);
	  return populatedUsers;
	}

	populateOne(pets, userId) {
	  const user = getOneById(userId);
	  const userPets = pets.filter(pet => (user.id === pet.userId));
	  if (pets.isEmpty) throw new Error('user does not have pet');
	  return { ...user, pets: userPets };
	}

	// populateUsersHavePetType(pets, petType) {
	// 	const populatedUsers = populate(pets);
	// 	const populatedUsersHavePetType =
	// 		populatedUsers.filter(user => (user.pets.some(pet => (pet.type === petType))));
	// 	if (!populatedUsersHavePetType) throw new Error('!populatedUsersHavePetType');
	// 	return populatedUsersHavePetType;
	// }

	populateUsersHavePetType(pets, petType) {
		const usersHasPetType = this.filterHavePetType(petType);
		const populatedUsersHavePetType = this.populate(pets, usersHasPetType);
		return populatedUsersHavePetType;
	}
}
