import validator from 'validator';

const validationRulesDefinitions = {
  required: {
    function: (value) => {
      let result = !(!value || value === null);
      if (typeof value === 'string') {
        result = (result && !validator.isEmpty(value));
      }
      return result;
    } },
  minLength: { parameters: ['minLength'], function: (minLength, value) => { return validator.isLength(value, { min: minLength, max: undefined }); } },
  maxLength: { parameters: ['maxLength'], function: (maxLength, value) => { return validator.isLength(value, { min: 0, max: maxLength }); } },
  alpha: { function: (value) => { return validator.isAlpha(value); } },
  numeric: { function: (value) => { return validator.isNumeric(value); } },
  decimal: { function: (value) => { return validator.isDecimal(value); } },
};

export default validationRulesDefinitions;
