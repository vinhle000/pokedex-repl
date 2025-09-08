import type { State } from './state';

export async function commandHelp(state: State): Promise<void> {
  console.log('Welcome to the Pokedex!');
  console.log('Usage:');
  Object.values(state.commands).forEach((command) => {
    console.log(`${command.name}: ${command.description}`);
  });
}
