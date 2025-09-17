import { State } from './state.js';
import { type Pokemon, PokemonInfo } from './pokeapi.js';

export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (!args || args.length === 0) {
    console.log('No pokemon name was provided to inspect');
  }

  const pokemonName = args[0];

  if (pokemonName in state.pokedex) {
    // print out info
    const pokemon = state.pokedex[pokemonName];
    // const { height, weight, stats, types }: PokemonInfo = pokemon.pokemonInfo;

    console.log(`Name: ${pokemon.name}`);
    console.log(`Height: ${pokemon.pokemonInfo?.height}`);
    console.log(`Weight: ${pokemon.pokemonInfo?.weight}`);

    console.log(`Stats:`);
    if (pokemon.pokemonInfo?.stats) {
      for (const item of Object.entries(pokemon.pokemonInfo.stats)) {
        console.log(` -${item[0]}: ${item[1]}`);
      }
    }

    console.log(`Types:`);
    pokemon.pokemonInfo?.types.forEach((type: string) => {
      console.log(` - ${type}`);
    });
  } else {
    console.log('you have not caught that pokemon');
  }
}
