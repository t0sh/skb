export default function () {
  return {
    reqUsers: require('./users').default(...arguments),
    reqPets: require('./pets').default(...arguments),
  }
}
