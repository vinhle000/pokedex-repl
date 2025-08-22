import { cleanInput } from './repl.js'; /// due to type: "module" in package.json
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { commandExit } from './command_exit.js';
import { commandHelp } from './command_help.js';
import type { CLICommand } from './command.js';

const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'Pokedex > ',
});

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: 'exit',
      description: 'Exits the pokedex',
      callback: commandExit,
    },
    help: {
      name: 'help',
      description: 'Provides tips and instructions',
      callback: commandHelp,
    },
  };
}

function main() {
  rl.prompt();
  rl.on('line', (line) => {
    const words = cleanInput(line);
    if (words.length === 0) {
      rl.prompt();
    } else {
      // console.log(`Your command was: ${words[0]}`);
      const inputCommand = words[0];
      const commands: Record<string, CLICommand> = getCommands();
      const command: CLICommand = commands[inputCommand];

      if (!!command) {
        command.callback(commands);
      } else {
        console.log('Unknown command');
      }

      rl.prompt();
    }
  });
}

main();
