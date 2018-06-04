import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';
import * as ValidationEngine from '../validation/validationEngine';

@observer
class Integer extends Component {

  constructor(props) {
    super(props);
    ValidationEngine.buildRules(this.props.validationStore, this.props);
  }
  handleChange =(e) => {
    const value = e.target.value && e.target.value !== '' ? parseInt(e.target.value, 10) : '';
    this.props.handleChange(value, this.props.validationRules, this.props.fieldId);
    ValidationEngine.validateRules(this.props.validationStore, e.target.value, this.props.parentId, this.props.fieldId, this.props.name);
  }

  prevent = (e) => {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }

  render() {
    let customErrorText;
    if (this.props.validationStore && this.props.validationStore.errors.length !== 0) {
      const fieldErrors = this.props.validationStore.getFieldErrors(this.props.fieldId);
      if (fieldErrors && fieldErrors.errors.length > 0) {
        customErrorText = ' ';
      }
    }
    return (
      <TextField
        hintText={this.props.hintText ? this.props.hintText : this.props.name}
        errorText={customErrorText}
        floatingLabelText={this.props.floatingLabelText !== null ? this.props.floatingLabelText : this.props.name}
        floatingLabelFixed={this.props.floatingLabelFixed !== null ? this.props.floatingLabelFixed : false}
        value={this.props.value !== null ? this.props.value : undefined}
        onChange={(e) => { this.handleChange(e); }}
        onBlur={(e) => { this.handleChange(e); }}
        onKeyPress={(e) => { this.prevent(e); }}
        underlineDisabledStyle={{ display: 'none' }}
        fullWidth={this.props.fullWidth !== false}
        hintStyle={this.props.hintStyle}
        inputStyle={this.props.inputStyle !== null ? this.props.inputStyle : { }}
        floatingLabelFocusStyle={this.props.floatingLabelFocusStyle != null ? this.props.floatingLabelFocusStyle : { }}
        floatingLabelStyle={this.props.floatingLabelStyle != null ? this.props.floatingLabelStyle : { }}
        underlineStyle={this.props.underlineStyle !== null ? this.props.underlineStyle : {}}
        underlineFocusStyle={this.props.underlineFocusStyle}
      />
    );
  }
}

export default Integer;
