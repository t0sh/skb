export default function canonize(str) {
  const re = /@?(https?:)?(\/\/)?(www\.)?(([a-z]*)[^\/]*\/)?([@a-zA-Z0-9\._]*)/i;
  const userName = str.match(re)[6];
  if (userName.charAt(0) === '@') {
     return userName;
   }
  return '@' + userName;

}
