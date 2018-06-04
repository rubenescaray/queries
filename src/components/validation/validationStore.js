import { observable } from 'mobx';

class ValidationStore {
  @observable errors = [];
  rules;

  constructor() {
    this.rules = [];
    this.errors = [];
  }

  isOfField(error, fieldName) {
    return error.field !== fieldName;
  }

  clearRules() {
    this.rules = [];
  }

  addRule(rule) {
    if (rule) {
      this.rules.push(rule);
    }
  }

  getFieldRules(fieldId) {
    let fieldRules;
    if (fieldId) {
      fieldRules = this.rules.filter((rule) => {
        return rule.fieldId === fieldId;
      });
    }
    return fieldRules;
  }

  addError = (error) => {
    if (error) {
      if (error.fieldId) {
        const fieldErrorsIndex = this.getFieldErrorsIndex(error.fieldId);
        let fieldErrors;
        if (fieldErrorsIndex === -1) {
          fieldErrors = [];
        } else {
          fieldErrors = this.errors.splice(fieldErrorsIndex, 1);
        }
        if (!fieldErrors.errors) {
          fieldErrors.errors = [];
        }
        fieldErrors.errors.push({ id: error.id, type: error.type, description: error.description });
        this.errors.push({ parentId: error.parentId, fieldId: error.fieldId, errors: fieldErrors.errors });
      }
    }
  }

  addErrors = (errors) => {
    if (errors && errors.length > 0) {
      this.errors = this.errors.concat(errors);
    }
  }

  removeError(fieldId, errorId, type) {
    if (fieldId && errorId) {
      const fieldErrorsIndex = this.getFieldErrorsIndex(errorId);
      if (fieldErrorsIndex > -1) {
        const fieldErrors = this.errors.splice(fieldErrorsIndex, 1);
        const errorIndex = fieldErrors.findIndex((error) => { return error.type === type; });
        if (errorIndex > -1) {
          this.errors.splice(errorIndex, 1);
          this.errors.push(fieldErrors);
        }
      }
    }
  }

  getFieldErrorsIndex(fieldId) {
    const fieldErrorsIndex = this.errors.findIndex((fieldIdErrors) => { return fieldIdErrors.fieldId === fieldId; });
    return fieldErrorsIndex;
  }

  getFieldErrors(fieldId) {
    let fieldErrors;

    if (fieldId) {
      const fieldErrorsIndex = this.getFieldErrorsIndex(fieldId);
      if (fieldErrorsIndex > -1) {
        fieldErrors = this.errors[fieldErrorsIndex];
      }
    }

    return fieldErrors;
  }

  getParentErrors(parentId) {
    let parentErrors;

    if (parentId) {
      const jsArray = this.errors.toJS();
      if (jsArray && jsArray.length > 0) {
        parentErrors = this.errors.toJS().filter((parentIdErrors) => { return parentIdErrors.parentId === parentId; });
      }
    }

    return parentErrors;
  }

  deleteParentErrors(parentId) {
    const notParentErrors = [];
    if (parentId) {
      this.errors.forEach((error) => {
        if (error.parentId !== parentId) {
          notParentErrors.push(error);
        }
      });
    }
    this.errors = notParentErrors;
  }

  deleteFieldErrors(fieldId) {
    if (fieldId) {
      const fieldErrorsIndex = this.getFieldErrorsIndex(fieldId);
      if (fieldErrorsIndex > -1) {
        return this.errors.splice(fieldErrorsIndex, 1);
      }
    }
    return null;
  }

  clearErrors() {
    this.errors.splice();
  }
}


export default ValidationStore;
