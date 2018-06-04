import validator from 'validator';
import Utils from '../../utils';

export const validationRulesDefinitions = {
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

export const validationRulesErrorsDescriptions = {
  required: 'El campo {fieldName} es requerido',
  minLength: 'La longitud del campo {fieldName} es menor',
  maxLength: 'La longitud del campo {fieldName} es mayor',
  alpha: 'El campo {fieldName} contiene caracteres que no son permitidos. Sólo debe contener letras.',
  numeric: 'El campo {fieldName} contiene caracteres que no son permitidos. Sólo debe contener números.',
  decimal: 'El campo {fieldName} contiene un valor que no representa un número decimal válido.'
};

export const buildRules = (validationStore, props) => {
  const rulesTypes = Object.keys(validationRulesDefinitions);
  rulesTypes.forEach((ruleType) => {
    if (props[ruleType]) {
      const ruleParameters = [];
      const ruleDefinition = validationRulesDefinitions[ruleType];
      if (ruleDefinition.parameters) {
        ruleDefinition.parameters.forEach((ruleParameter) => {
          ruleParameters.push(props[ruleParameter]);
        });
      }
      const rule = { parentId: props.parentId, fieldId: props.fieldId, field: props.name, type: ruleType, parameters: ruleParameters, run: ruleDefinition.function };
      validationStore.addRule(rule);
    }
  });
};

export const runRules = (rules, value) => {
  let rulesResults;
  if (rules && rules !== null) {
    rulesResults = [];
    rules.forEach((rule) => {
      rulesResults.push({ type: rule.type, result: rule.run(...rule.parameters, value) });
    });
  }
  return rulesResults;
};

export const validateRules = (validationStore, value, p_parentId, p_fieldId, fieldName) => {
  validationStore.deleteFieldErrors(p_fieldId);
  const rulesResults = runRules(validationStore.getFieldRules(p_fieldId), value);
  if (rulesResults && rulesResults.length > 0) {
    let result = true;
    rulesResults.forEach((ruleResult) => {
      result = result && ruleResult.result;
      if (ruleResult.result === false) {
        const errorDescription = validationRulesErrorsDescriptions[ruleResult.type];
        const validationError = {
          id: Utils.getNewId(),
          parentId: p_parentId,
          fieldId: p_fieldId,
          type: ruleResult.type,
          description: errorDescription.replace(/\{fieldName\}/i, fieldName)
        };
        validationStore.addError(validationError);
      }
    });
    return result;
  }

  return true;
};
