import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Parameter from './Parameter';

const style = {
  parameters: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  }
};

@observer
class ParameterValues extends Component {
  constructor(props) {
    super(props);
    this.validationStore = this.props.validationStore;
  }
  handleChangeInputValue = (fieldName, value) => {
    const parameter = this.props.store.findParameter(fieldName);
    parameter.value = value;
  }
  handleChangeCheckBoxValue = (fieldName, isRequired) => {
    const parameter = this.props.store.findParameter(fieldName);
    parameter.requireOnExecution = isRequired;
  };
  handleChangeLabelValue = (fieldName, label) => {
    const parameter = this.props.store.findParameter(fieldName);
    parameter.label = label;
  }
  render() {
    if (this.props.editingMode !== true) {
      style.parameters.flexDirection = 'row';
    }
    return (
      <div>
        <div style={style.parameters}>
          {this.props.store.parameters.map((parameter) => {
            return (<Parameter
              {...parameter}
              key={parameter.id}
              validationStore={this.validationStore}
              handleChangeInputValue={this.handleChangeInputValue}
              handleChangeCheckBoxValue={this.handleChangeCheckBoxValue}
              handleChangeLabelValue={this.handleChangeLabelValue}
              editingMode={this.props.editingMode}
              sourceExecute={this.props.sourceExecute}
              onlyLabelAndValue={this.props.onlyLabelAndValue}
              store={this.props.store}
            />);
          })}
        </div>
      </div>
    );
  }
}

export default ParameterValues;
