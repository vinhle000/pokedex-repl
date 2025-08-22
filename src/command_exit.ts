import type { CLICommand } from './command.js';

export function commandExit() {
  console.log('Closing the Pokedex... Goodbye!');
  process.exit(0);
}
