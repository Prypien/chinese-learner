/** Split a traditional Chinese string into individual characters. */
export function splitCharacters(text: string): string[] {
  return [...text].filter((c) => c.trim().length > 0);
}
