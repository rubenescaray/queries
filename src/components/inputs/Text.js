import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';
import * as ValidationEngine from '../validation/validationEngine';

@observer
class Text extends Component {
  constructor(props) {
    super(props);
    if (this.props.validationStore !== undefined) {
      ValidationEngine.buildRules(this.props.validationStore, this.props);
    }
  }
  handleChange = (e) => {
    if (this.props.validationStore !== undefined) {
      ValidationEngine.validateRules(this.props.validationStore, e.target.value, this.props.parentId, this.props.fieldId, this.props.name);
    }
    this.props.handleChange(e.target.value);
  }
  handleBlur = (e) => {
    if (this.props.handleBlur) {
      this.props.handleBlur(e.target.value);
    }
  }
  render() {
    const isDisabled = this.props.disabled || false;
    let customErrorText;
    if (this.props.validationStore !== undefined && this.props.validationStore.errors.length !== 0) {
      const fieldErrors = this.props.validationStore.getFieldErrors(this.props.fieldId);
      if (fieldErrors && fieldErrors.errors.length > 0) {
        customErrorText = ' ';
      }
    }
    return (

      <TextField
        id={this.props.id}
        hintText={this.props.hintText ? this.props.hintText : this.props.name}
        errorText={customErrorText}
        floatingLabelText={this.props.floatingLabelText !== null ? this.props.floatingLabelText : this.props.name}
        floatingLabelFixed={this.props.floatingLabelFixed !== null ? this.props.floatingLabelFixed : false}
        value={this.props.value ? this.props.value : ''}
        onChange={(e) => { this.handleChange(e); }}
        onBlur={(e) => { this.handleChange(e); }}
        fullWidth={!!(this.props.fullWidth === undefined || this.props.fullWidth)}
        underlineDisabledStyle={{ display: 'none' }}
        disabled={isDisabled}
        style={this.props.style !== null ? this.props.style : {}}
        //labelStyle={this.props.labelStyle !== null ? this.props.style : {}}
        inputStyle={this.props.inputStyle !== null ? this.props.inputStyle : { }}
        hintStyle={this.props.hintStyle !== null ? this.props.hintStyle : {}}
        underlineStyle={this.props.underlineStyle !== null ? this.props.underlineStyle : {}}
        floatingLabelStyle={this.props.floatingLabelStyle != null ? this.props.floatingLabelStyle : { }}
        underlineFocusStyle={this.props.underlineFocusStyle}
      />
    );
  }
}

export default Text;
