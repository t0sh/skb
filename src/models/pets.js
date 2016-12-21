
export function getOneById(pets, id) {
  const pet = pets.find(obj => (obj.id === id));
  if (!pet) throw new Error(`!pet id= ${id}`);
  return pet;
}

export function filterByType(pets, typePet) {
  const petsByType = pets.filter(pet => (pet.type === typePet));
  if (!petsByType) throw new Error(`!pets by type ${typePet}`);
  return petsByType;
}

export function filterAgeMoreThen(pets, age_gt) {
  const petsAgeMoreThen = pets.filter(pet => (pet.age > age_gt));
  if (!petsAgeMoreThen) throw new Error(`!pets age more then ${age_gt}`);
  return petsAgeMoreThen;
}

export function filterAgeLessThen(pets, age_lt) {
  const petsAgeLessThen = pets.filter(pet => (pet.age < age_lt));
  if (!petsAgeLessThen) throw new Error(`!pets age less then ${age_lt}`);
  return petsAgeLessThen;
}

export function filterByUser(pets, user) {
  const petsByUser = pets.filter(pet => (pet.userId === user.id));
  if (!petsByUser) throw new Error(`!pets by user ${user.name}`);
  return petsByUser;
}

export function populate(pets, users) {
  const populatedPets = pets.map((pet) => {
    const user = users.find(usr => (usr.id === pet.userId));
    return { ...pet, user };
  });
  if (!populatedPets) throw new Error('!populatedPets');
  return populatedPets;
}

export function populateOne(pet, users) {
  const user = users.find(currentUser => (currentUser.id === pet.userId));
  if (!user) throw new Error('!user with such pet');
  return { ...pet, user };
}
