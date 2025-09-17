import { State } from './state.js';
import { type LocationAreaInfo, Pokemon } from './pokeapi.js';

export async function commandCatch(
  state: State,
  ...args: string[]
): Promise<void> {
  if (!args || args.length === 0) {
    console.log('No pokemon name was provided catch');
    return;
  }

  const pokemonName = args[0];

  const pokemon: Pokemon = await state.pokeApi.fetchPokemonInfo(pokemonName);

  // NOTE: only to handle optional type,
  // this is due to Pokemon type being used in fetchLocationAreaInfo, which does not provide that prop
  // where fetchPokemonInfo's response does include that prop,
  //
  if (!pokemon.baseExperience) {
    console.error(`${pokemon.name} missing base experience info`);
    throw new Error(`base experience missing from pokemon info`);
  }

  console.log(`Throwing a Pokeball at ${pokemon.name}... `);

  const catchScore = Math.floor(Math.random() * 100);
  const scoreRequirement = getCatchScoreRequirement(pokemon.baseExperience);

  if (catchScore >= scoreRequirement) {
    state.pokedex[pokemon.name] = pokemon;

    console.log(`${pokemon.name} was caught!`);
  } else {
    console.log(`${pokemon.name} escaped!`);
  }
}

/*
 * Helper function to determine min number required to successfully catch the pokemon
 * Used to compare with catchScore which will be 0 - 100 possible
 *
 * scoreRequirement calculated:
 * pokemon's baseXP / maxXP( which is 635 would be highest possible value received)
 * EX)  difficultyPercentage = (36/635)
 *     scoreRequirement = difficultyPercentage * 80
 *  easiest will be ~ 4.5 (this is based off the lowest baseXP of 36)
 *  hardest will be 80
 *
 */
function getCatchScoreRequirement(baseExperience: number): number {
  const maxBaseExperience = 635;
  const maxDifficulty = 80; // this will the ceiling of how hard to catch a pokemon

  const rate = baseExperience / maxBaseExperience;
  return Math.floor(rate * maxDifficulty);
}
