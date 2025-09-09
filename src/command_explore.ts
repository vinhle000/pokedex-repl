import { State } from './state.js';
import { type LocationAreaInfo, Pokemon } from './pokeapi.js';

export async function commandExplore(
  state: State,
  ...args: string[]
): Promise<void> {
  if (!args || args.length === 0) {
    console.log('No location area name was provided to explore');
    return;
  }

  const locationName: string = args[0];
  console.log(`Exploring ${locationName}...`);
  console.log('Found Pokemon:');

  const locationAreaInfo: LocationAreaInfo =
    await state.pokeApi.fetchLocationAreaInfo(locationName);

  locationAreaInfo.pokemonEncounters.forEach((pokemon: Pokemon) => {
    console.log(' - ', pokemon.name);
  });
}
