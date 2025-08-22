import { cleanInput } from './repl';
import { describe, expect, test } from 'vitest';

describe.each([
  {
    input: ' hello      world ',
    expected: ['hello', 'world'],
  },
  {
    input: 'THIS IS ALL CAPS',
    expected: ['this', 'is', 'all', 'caps'],
  },
])('cleanInput($input)', ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    expect(actual).toHaveLength(expected.length);

    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
