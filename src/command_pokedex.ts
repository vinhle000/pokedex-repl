import { State } from './state';

export async function commandPokedex(state: State): Promise<void> {
  const { pokedex } = state;

  Object.keys(pokedex).forEach((pokemonName) => {
    console.log(` - ${pokemonName}`);
  });
}
