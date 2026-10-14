class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.code = 'bad_request';
  }
}

function optionalString(query, name) {
  const value = query[name];
  if (value === undefined) return undefined;
  if (typeof value !== 'string') {
    throw new BadRequestError(`El parámetro ${name} debe ser texto.`);
  }
  return value;
}

function integerParameter(query, name, defaultValue, minimum, maximum) {
  const rawValue = query[name];
  if (rawValue === undefined) return defaultValue;

  if (typeof rawValue !== 'string' || !/^-?\d+$/.test(rawValue)) {
    throw new BadRequestError(`El parámetro ${name} debe ser un entero.`);
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value)) {
    throw new BadRequestError(`El parámetro ${name} debe ser un entero.`);
  }

  if (value < minimum || (maximum !== undefined && value > maximum)) {
    if (maximum !== undefined) {
      throw new BadRequestError(
        `El parámetro ${name} debe estar entre ${minimum} y ${maximum}.`,
      );
    }
    throw new BadRequestError(
      `El parámetro ${name} debe ser mayor o igual a ${minimum}.`,
    );
  }

  return value;
}

function parseListQuery(query) {
  return {
    ciudad: optionalString(query, 'ciudad'),
    provincia: optionalString(query, 'provincia'),
    limit: integerParameter(query, 'limit', 20, 1, 100),
    offset: integerParameter(query, 'offset', 0, 0),
  };
}

module.exports = { BadRequestError, parseListQuery };
