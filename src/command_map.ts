import type { State } from './state.js';
import type { ShallowLocations, Location } from './pokeapi.js';

export async function commandMap(state: State): Promise<void> {
  const { pokeApi, nextLocationURL } = state;
  const shallowLocations: ShallowLocations = await pokeApi.fetchLocations(
    nextLocationURL
  );
  const { next, previous, locations } = shallowLocations;

  state.nextLocationURL = next;
  state.prevLocationURL = previous;

  locations.forEach((location) => {
    console.log(location.name);
  });
}

export async function commandMapBack(state: State): Promise<void> {
  const { pokeApi, prevLocationURL } = state;

  const shallowLocations: ShallowLocations = await pokeApi.fetchLocations(
    prevLocationURL
  );

  const { next, previous, locations } = shallowLocations;

  state.nextLocationURL = next;
  state.prevLocationURL = previous;

  locations.forEach((location) => {
    console.log(location.name);
  });
}
