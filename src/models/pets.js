import _ from 'lodash';

export default class Pets {
  constructor(petsData) {
    return petsData.pets;
  }

  filterByType(typePet) {
    if (!typePet) throw new Error('!typePet'); // нужно ли тут генерить ошибку что нет оператора?
    const petsByType = this.filter(pet => (pet.type === typePet));
    if (!petsByType) throw new Error('!petsByType'); // нужно ли тут генерить ошибку что нет животных с таким типом или отдавать андеф?
    return petsByType;
  }

  filterAgeMoreThen(age_gt) {
    if (!age_gt) throw new Error('!age_gt');
    const petsAgeMoreThen = this.filter(pet => (pet.age > age_gt));
    if (!petsAgeMoreThen) throw new Error('!petsAgeMoreThen');
    return petsAgeMoreThen;
  }

  filterAgeLessThen(age_lt) {
		if (!age_lt) throw new Error('!age_lt');
    const petsAgeLessThen = this.filter(pet => (pet.age < age_lt));
		if (!petsAgeLessThen) throw new Error('!petsAgeLessThen');
		return petsAgeMoreThen;
	}

  filterByUser(user) {
    return this.filter(pet => (pet.userId === user.id))
  }

  populate(users) {
    const populatedPets = this.map((pet) => {
      const user = _.find(users, user => (user.id === pet.userId));
      return { ...pet, user };
    });
		if (!populatedPets) throw new Error('!populatedPets');
		return populatedPets;
  }

	getOneById(id) {
		return _.find(this, obj => (obj.id === id))
	}

	populateOne(users, petId) {
	  const pet = getOneById(petId);
		if (!pet) throw new Error('!pet');
		const user = _.find(users, currentUser => (currentUser.id === pet.userId));
	  if (!user) throw new Error('!user');
	  return { ...pet, user };
	}
}
