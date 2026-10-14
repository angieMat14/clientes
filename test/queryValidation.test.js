const test = require('node:test');
const assert = require('node:assert/strict');
const { parseListQuery } = require('../src/queryValidation');

test('usa la paginación predeterminada del contrato', () => {
  assert.deepEqual(parseListQuery({}), {
    ciudad: undefined,
    provincia: undefined,
    limit: 20,
    offset: 0,
  });
});

test('acepta filtros y paginación válidos', () => {
  assert.deepEqual(
    parseListQuery({
      ciudad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      limit: '50',
      offset: '10',
    }),
    {
      ciudad: 'Bahía Blanca',
      provincia: 'Buenos Aires',
      limit: 50,
      offset: 10,
    },
  );
});

test('rechaza limit fuera del rango permitido', () => {
  assert.throws(
    () => parseListQuery({ limit: '101' }),
    { statusCode: 400, code: 'bad_request' },
  );
});

test('rechaza valores que no sean enteros', () => {
  assert.throws(
    () => parseListQuery({ offset: '1.5' }),
    { statusCode: 400, code: 'bad_request' },
  );
});

test('rechaza filtros que no sean valores de texto simples', () => {
  assert.throws(
    () => parseListQuery({ ciudad: ['Córdoba', 'Rosario'] }),
    { statusCode: 400, code: 'bad_request' },
  );
});
