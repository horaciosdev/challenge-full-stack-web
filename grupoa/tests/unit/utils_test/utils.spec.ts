import { test } from '@japa/runner'
import { cpfMask } from '../../../utils/mask_utils.js';
import { justNumbers } from '../../../utils/string_utils.js';

test.group('Utils', () => {
  test('must format the cpf correctly', ({ assert }) => {
    const testCases = [
      { input: '12345678901', expected: '123.456.789-01' }, // Caso completo
      { input: '00000000000', expected: '000.000.000-00' }, // Zeros
      { input: '', expected: '' }, // String vazia
    ]

    testCases.forEach(({ input, expected }) => {
      assert.equal(cpfMask(input), expected)
    })
  })

  test('returns only the numbers from the input string', ({ assert }) => {
    const input = 'A1B2C3#4$5%6~7[8]9{0}1';

    assert.equal(justNumbers(input), '12345678901');
  })
})