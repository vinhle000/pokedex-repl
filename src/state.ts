import { createInterface, type Interface } from 'readline';
import { stdin, stdout } from 'node:process';
import { commandExit } from './command_exit.js';
import { commandHelp } from './command_help.js';
import { commandMap, commandMapBack } from './command_map.js';
import { commandExplore } from './command_explore.js';
import { commandCatch } from './command_catch.js';
import { commandInspect } from './command_inspect.js';
import { commandPokedex } from './command_pokedex.js';
import { PokeAPI, type Pokemon } from './pokeapi.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  readLineInterface: Interface;
  commands: Record<string, CLICommand>;
  pokeApi: PokeAPI;
  pokedex: Record<string, Pokemon>;
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
    explore: {
      name: 'explore',
      description: `Fetch list of pokemon encounters in the provided location area`,
      callback: commandExplore,
    },
    catch: {
      name: 'catch',
      description:
        'Attempt to catch a pokemon from provided name and save to pokedex',
      callback: commandCatch,
    },
    inspect: {
      name: 'inspect',
      description: 'Get info of caught pokemon from pokedex',
      callback: commandInspect,
    },
    pokedex: {
      name: 'pokedex',
      description: 'Shows list of pokemon in pokedex',
      callback: commandPokedex,
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
    pokedex: {},
    nextLocationURL: null,
    prevLocationURL: null,
  };
  return state;
}
