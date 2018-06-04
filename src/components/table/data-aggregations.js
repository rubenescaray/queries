import math from 'mathjs';

export const runOperation = (operator, data) => {
  let result;
  if (data && data.length && data.length > 0) {
    result = math[operator](data);
  }
  return result;
};

export const aggregationOperation = (operator) => {
  return math[operator === 'count' ? 'setSize' : operator];
};

export const operationDescriptor = {
  sum: 'Suma',
  mean: 'Promedio',
  max: 'Máx',
  min: 'Mín',
  setSize: 'Cantidad'
};

