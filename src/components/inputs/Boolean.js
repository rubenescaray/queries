import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Boolean extends Component {
  handleChange = (e, fieldName, value) => {
    this.props.handleChange(fieldName, value);
  }
  prevent = (e) => {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }
  render() {
    return (
      <SelectField
        floatingLabelText={this.props.floatingLabelText ? this.props.floatingLabelText : this.props.name}
        floatingLabelFixed={this.props.floatingLabelFixed !== null ? this.props.floatingLabelFixed : false}
        underlineDisabledStyle={{ display: 'none' }}
        onChange={(e, index, value) => { this.handleChange(e, this.props.name, value); }}
        fullWidth={this.props.fullWidth !== false}
        labelStyle={this.props.labelStyle !== null ? this.props.labelStyle : { }}
      >
        <MenuItem value="true" primaryText="Verdadero" />
        <MenuItem value="false" primaryText="Falso" />
      </SelectField>
    );
  }
}

export default Boolean;
