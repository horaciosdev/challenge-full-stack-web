export function justNumbers(value: string): string {
    return value ? value.replace(/[^\d]/g, '') : value
}