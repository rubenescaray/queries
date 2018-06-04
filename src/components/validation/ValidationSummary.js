import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './ValidationSummary.css';

@observer
class ValidationSummary extends Component {
  render() {
    const validations = [];
    this.props.errors.forEach((error) => {
      error.errors.forEach((err) => {
        validations.push(<div key={err.id} className="error">{err.description}</div>);
      });
    });
    return (
      <div className="validation-summary">
        {validations}
      </div>
    );
  }
}

export default ValidationSummary;
