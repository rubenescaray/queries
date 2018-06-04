import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Field from './Field';
import './SelectFilter.css';

const style = {
  width: 15
};

@observer
class SelectFilter extends Component {
  handleChangeInput = (fieldId, value) => {
    const field = this.props.store.findField(fieldId);
    field.label = value;
    this.props.updateCallback();
  }
  handleChangeCheckbox =(fieldId, isChecked) => {
    const field = this.props.store.findField(fieldId);
    field.include = isChecked;
    this.props.updateCallback();
  }
  handleChangeType = (fieldId, type) => {
    const field = this.props.store.findField(fieldId);
    field.type = type;
    this.props.updateCallback();
  }
  render() {
    const { onlyCheckAndLabel } = this.props;
    return (
      <div>
        <div className="select">
          <div className="select-title">
            <div className="column" style={{ width: '5%' }}>
                Incl.
            </div>
            {!onlyCheckAndLabel && <div style={{ width: '23%' }} className="column">Nombre Real</div>}
            <div className="column" style={{ width: '23%' }}>Etiqueta</div>
            {!onlyCheckAndLabel && <div style={{ width: '29%' }} className="column">Tipo</div>}
            <div style={style} />
          </div>
          <div className="content">
            {this.props.store.selects.map((field) => {
              return (
                <div style={{ display: 'block' }} key={field.id}>
                  <Field
                    {...field}
                    key={field.id}
                    handleChangeCheckbox={this.handleChangeCheckbox}
                    handleChangeInput={this.handleChangeInput}
                    handleChangeType={this.handleChangeType}
                    onlyCheckAndLabel={this.props.onlyCheckAndLabel}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectFilter;
