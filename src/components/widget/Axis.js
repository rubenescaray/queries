import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import { Row, Column } from '../../components/layout/gridSystem';

const style = {
  flex: '3',
  alignSelf: 'center'
};


@observer
class Axis extends Component {
  handleChangeAxisLegend = (event) => {
    const value = event.target.value;
    this.props.handleChangeAxisLegend(this.props.name, value);
  }
  handleChangeAxisDataSource = (value) => {
    this.props.handleChangeAxisDataSource(this.props.name, value);
  }

  render() {

    return (
      <div>
        <Row>
          <Column>
            <h5 style={style}>
              {this.props.name}
            </h5>
          </Column>
          <Column>
            <TextField
              floatingLabelText="Leyenda"
              hintText="Leyenda del eje"
              floatingLabelFixed
              onChange={(e) => { this.handleChangeAxisLegend(e); }}
              value={this.props.legend}
            />
          </Column>
          <Column>
            <SelectField
              floatingLabelText="Seleccione campo"
              underlineShow={false}
              fullWidth
              onChange={(event, index, value) => { return this.handleChangeAxisDataSource(value); }}
              value={this.props.dataSource}
            >
              {this.props.fields.map((column) => {
                return <MenuItem key={column.id} value={column.name} primaryText={column.label ? column.label : column.name} />;
              })}
            </SelectField>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Axis;
