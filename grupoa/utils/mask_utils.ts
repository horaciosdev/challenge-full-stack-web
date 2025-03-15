export const cpfMask = (value: string): string => {
    let maskedValue = value.replace(/\D/g, '');

    maskedValue = maskedValue.substring(0, 11);

    if (maskedValue.length > 3) maskedValue = maskedValue.replace(/^(\d{3})(\d)/, '$1.$2');
    if (maskedValue.length > 6) maskedValue = maskedValue.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (maskedValue.length > 9) maskedValue = maskedValue.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    return maskedValue;
};