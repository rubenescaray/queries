import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Parameter from './Parameter';


@observer
class ParameterMapper extends Component {
  componentDidMount = () => {
    this.props.store.options = this.props.options;
    //this.props.store.loadProperties(this.props.mappedParameters, this.props.parameters);
  }

  /*componentWillReceiveProps(nextProps) {
    //nextProps.store.loadProperties(nextProps.mappedParameters, nextProps.parameters);
  }*/

  handleChangeParamFieldName = (param, value) => {
    this.props.store.setParamFieldName(param, value);
  }

  render() {
    return (
      <div>
        <h5 style={{ fontWeight: 'normal', fontSize: '13px', color: 'gray' }}>Filtros para Vincular</h5>
        <div style={{ marginTop: '-50px' }}>
          {this.props.store.parameters.map((p, i) => {
            return (
              <Parameter
                key={i}
                {...p}
                options={this.props.options}
                handleChangeParamFieldName={this.handleChangeParamFieldName}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ParameterMapper;
