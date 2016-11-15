import express from 'express';

//import cors from 'cors';
import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';
import _ from 'lodash';

const _DEV_ = true;

const app = express();

//app.use(cors());

const baseUrl = 'https://pokeapi.co/api/v2';
const pokemonFields = ['id', 'name', 'base_experience', 'is_default', 'order', 'weight'];

async function getPokemons(url, i = 0) {
  console.log('getPokemons ', url, i);
  const response = await fetch(url);
  const page = await response.json();
  const pokemons = page.results;
  if (_DEV_ && i > 1) {
    return pokemons;
  }

  if (page.next) {
    const pokemons2 = await getPokemons(page.next, i + 1);
    return [
      ...pokemons,
      ...pokemons2,
    ];
  }

  return pokemons;
}

async function getPokemon(url) {
  console.log('getPokemon ', url);
  const response = await fetch(url);
  const pokemon = await response.json();
  return pokemon;
}

app.get('/', async (req, res) => {
  try {
    const pokemonsUrl = `${baseUrl}/pokemon`;

    // const pokemonsUrl = https://pokeapi.co/api/v2/pokemon;

    const pokemonsInfo = await getPokemons(pokemonsUrl);
    const pokemonsPromises = pokemonsInfo.slice(0, 39).map(info =>
      getPokemon(info.url));

    const pokemonsFull = await Promise.all(pokemonsPromises);
    const pokemons = pokemonsFull.map(pokemon =>
      _.pick(pokemon, pokemonFields));
    const sortPokemons = _.sortBy(pokemons, pokemon => -pokemon.weight);

    return res.json(sortPokemons);
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
