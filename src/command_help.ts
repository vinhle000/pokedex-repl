import type { State } from './state';

export function commandHelp(state: State) {
  console.log('Welcome to the Pokedex!');
  console.log('Usage:');
  Object.values(state.commands).forEach((command) => {
    console.log(`${command.name}: ${command.description}`);
  });
}
