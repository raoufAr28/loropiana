/**
 * Generates a URL-friendly slug from a string.
 * @param value The string to slugify
 * @returns A lowercase, trimmed, hyphenated string with special characters removed.
 */
export function slugify(value: string): string {
  return value
    .toString()
    .normalize("NFD") // split accented characters into components
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w-]+/g, "") // remove special characters
    .replace(/--+/g, "-") // replace multiple hyphens with single one
    .replace(/^-+/, "") // remove leading hyphens
    .replace(/-+$/, ""); // remove trailing hyphens
}
