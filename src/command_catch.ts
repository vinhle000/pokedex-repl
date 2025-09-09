import { State } from './state.js';
import { type LocationAreaInfo, Pokemon } from './pokeapi.js';

/* TODO
It's time to catch some pokemon! Catching Pokemon adds them to the user's Pokedex.

Add a catch command. It takes the name of a Pokemon as an argument. Example usage:

Pokedex > catch pikachu
Throwing a Pokeball at pikachu...
pikachu escaped!
Pokedex > catch pikachu
Throwing a Pokeball at pikachu...
pikachu was caught!

 [ ] Be sure to print the Throwing a Pokeball at <pokemon>... message before determining
    if the Pokemon was caught or not.
 [ ] se the Pokemon endpoint to get information about a Pokemon by name.
 [ ] Give the user a chance to catch the Pokemon using the Math.random() static method.
 [ ] You can use the pokemon's "base experience" to determine the chance of catching it.
    The higher the base experience, the harder it should be to catch.
 [ ] Once the Pokemon is caught, add it to the user's Pokedex. The user's "pokedex" should
   just be a Record<string, Pokemon> (a map of Pokemon by name) stored in the State object.


   [ ] Test the catch command manually - make sure you can actually catch a
   Pokemon within a reasonable number of tries.
 [ ] Run the CLI again and tee the output (which copies the stdout)
   to a new file called repl.log (and .gitignore the log).

*/

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

  // console.debug(`DEBUG ---- catch scored ${catchScore} / ${scoreRequirement}`);

  if (catchScore >= scoreRequirement) {
    state.pokedex[pokemon.name] = pokemon;

    // console.debug(
    //   `DEBUG --- saved to pokedex `,
    //   JSON.stringify(state.pokedex, null, 2)
    // );

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
