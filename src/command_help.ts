import type { CLICommand } from './command.js';

export function commandHelp(commands: Record<string, CLICommand>) {
  console.log('Welcome to the Pokedex!');
  console.log('Usage:');

  Object.values(commands).forEach((command) => {
    console.log(`${command.name}: ${command.description}`);
  });
}
