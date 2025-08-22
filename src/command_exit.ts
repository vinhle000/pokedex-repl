import type { State } from './state.js';

export function commandExit(state: State) {
  console.log('Closing the Pokedex... Goodbye!');
  state.readLineInterface.close();
  process.exit(0);
}
