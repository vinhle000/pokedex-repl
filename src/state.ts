import { createInterface, type Interface } from 'readline';
import { stdin, stdout } from 'node:process';
import { commandExit } from './command_exit.js';
import { commandHelp } from './command_help.js';
import { commandMap, commandMapBack } from './command_map.js';
import { PokeAPI } from './pokeapi.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
  readLineInterface: Interface;
  commands: Record<string, CLICommand>;
  pokeApi: PokeAPI;
  nextLocationURL: string | null;
  prevLocationURL: string | null;
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
    map: {
      name: 'map',
      description: `Fetches 20 location areas from PokeAPI and list them out \n fetches next 20 ifo command is used again`,
      callback: commandMap,
    },
    mapb: {
      name: 'mapb',
      description: `Fetches prev 20 location areas from PokeAPI`,
      callback: commandMapBack,
    },
  };
}

export function initState(): State {
  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: 'Pokedex > ',
  });

  const pokeApi = new PokeAPI();

  const state: State = {
    readLineInterface: rl,
    commands: getCommands(),
    pokeApi: pokeApi,
    nextLocationURL: null,
    prevLocationURL: null,
  };
  return state;
}
