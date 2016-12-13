import _ from 'lodash';

export default class Pets {
  constructor(petsData) {
    return petsData.pets;
  }

  const getPetsByType = (typePet => {
    if (!typePet) throw new Error('!typePet');
    const petsByType = this.filter(pet => (pet.type === typePet));
    if (!petsByType) throw new Error('!petsByType');
    return petsByType;
  });

  const getPetsAgeMoreThen = (age_gt => {
    if (!age_gt) throw new Error('!age_gt');
    const petsAgeMoreThen = this.filter(pet => (pet.age > age_gt));
    if (!petsAgeMoreThen) throw new Error('!petsAgeMoreThen');
  });

  const getPetsAgeLessThen = (age_lt =>
    this.filter(pet => (pet.age < age_lt))
  );

  const getPetById = (id =>
    _.find(this, obj => (obj.id === id))
  );

  const getPetsByUser = (user =>
    this.filter(pet => (pet.userId === user.id))
  );

  const populates = (users =>
    this.map((pet) => {
      let newPet = _.clone(pet);
      newPet.user = _.find(users, user => (user.id === pet.userId));
      return newPet;
    })
  );

  const populate = (users, petId) => {
    const pet = getPetById(petId);
    return _.find(users, user => (user.id === pet.userId));
  };
}
