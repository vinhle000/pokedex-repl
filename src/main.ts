import { cleanInput } from './repl.js'; /// due to type: "module" in package.json
import { initState, type State } from './state.js';

const initialState: State = initState();

async function main(state: State) {
  const { readLineInterface: rl, commands } = state;
  rl.prompt();
  rl.on('line', async (line) => {
    const words = cleanInput(line);
    if (words.length === 0) {
      rl.prompt();
    } else {
      const inputCommand = words[0];
      const command = commands[inputCommand];

      if (!!command && words.length > 1) {
        await command.callback(state, ...words.slice(1)); // Spread the array
      } else if (!!command) {
        await command.callback(state);
      } else {
        console.log('Unknown command');
      }

      rl.prompt();
    }
  });
}

main(initialState);

/*
Update the entrypoint to treat the repl loop as an async function and properly await the callback functions.

Handle potential network errors with a try/catch block.
You can make GET requests in your browser or by using curl! It's convenient for testing and debugging.

*/
