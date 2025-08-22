import { createInterface, type Interface } from 'readline';
import { stdin, stdout } from 'node:process';
import { commandExit } from './command_exit.js';
import { commandHelp } from './command_help.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
  readLineInterface: Interface;
  commands: Record<string, CLICommand>;
};

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

export function initState(): State {
  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: 'Pokedex > ',
  });

  const state: State = {
    readLineInterface: rl,
    commands: getCommands(),
  };
  return state;
}
