/**
 * Convert string to PascalCase
 * @param str - The string to convert
 * @returns The string in PascalCase format
 * @throws {TypeError} If input is not a string
 */
export function toPascalCase(str: string): string {
    if (typeof str !== 'string') {
        throw new TypeError(`Expected string, received ${typeof str}`);
    }

    if (str.length === 0) {
        return '';
    }

    return str
        .toLowerCase()
        .replace(/[-_\s\/]+(.)?/g, (_, char?: string): string =>
            char?.toUpperCase() ?? ''
        )
        .replace(/^[a-z]/, (char: string): string => char.toUpperCase());
}
