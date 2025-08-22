export function cleanInput(input: string): string[] {
  const strs: string[] = input.split(' ');

  const words: string[] = [];

  for (const str of strs) {
    if (str.length > 0) {
      words.push(str.toLowerCase().trim());
    }
  }

  return words;
}
