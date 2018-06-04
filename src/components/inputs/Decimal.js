import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import * as ValidationEngine from '../validation/validationEngine';

@observer
class Decimal extends Component {

  constructor(props) {
    super(props);
    ValidationEngine.buildRules(this.props.validationStore, this.props);
  }

  handleChange = (e) => {
    if (ValidationEngine.validateRules(this.props.validationStore, e.target.value, this.props.parentId, this.props.fieldId, this.props.name)) {
      const value = Number(e.target.value);
      this.props.handleChange(value);
    } else {
      //console.log(this.props.validationStore.errors);
      //console.log(this.props.validationStore.getFieldErrors(this.props.fieldId));
    }
  }

  prevent = (e) => {
    if ((e.charCode < 48 && e.charCode !== 46) || e.charCode > 57) {
      e.preventDefault();
    }
  }

  render() {
    let customErrorText;
    if (this.props.validationStore.errors.length !== 0) {
      const fieldErrors = this.props.validationStore.getFieldErrors(this.props.fieldId);
      if (fieldErrors && fieldErrors.errors.length > 0) {
        customErrorText = ' ';
      }
    }
    return (
      <div style={{ marginTop: '24px' }}>
        <TextField
          hintText={this.props.hintText ? this.props.hintText : this.props.name}
          errorText={customErrorText}
          floatingLabelText={this.props.floatingLabelText !== null ? this.props.floatingLabelText : this.props.name}
          floatingLabelFixed={this.props.floatingLabelFixed !== null ? this.props.floatingLabelFixed : false}
          value={this.props.value !== null ? this.props.value : undefined}
          onChange={(e) => { this.handleChange(e, this.props.name); }}
          onBlur={(e) => { this.handleChange(e, this.props.name); }}
          onKeyPress={(e) => { this.prevent(e); }}
          underlineDisabledStyle={{ display: 'none' }}
          fullWidth={this.props.fullWidth !== false}
          inputStyle={this.props.inputStyle !== null ? this.props.inputStyle : { }}
          floatingLabelFocusStyle={this.props.floatingLabelFocusStyle != null ? this.props.floatingLabelFocusStyle : { }}
          floatingLabelStyle={this.props.floatingLabelStyle != null ? this.props.floatingLabelStyle : { }}
          underlineStyle={this.props.underlineStyle !== null ? this.props.underlineStyle : {}}
          underlineFocusStyle={this.props.underlineFocusStyle}
        />
      </div>
    );
  }
}

export default Decimal;
