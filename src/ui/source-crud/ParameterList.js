import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import ReactTable from 'react-table';
import SelectField from 'material-ui/SelectField';

const style = {
  margin: 20,
};

const renderList = function (parameters) {
  const gridColumns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Type',
      accessor: 'type'
    }
  ];
  if (parameters.length !== 0) {
    return (<ReactTable
      data={parameters || []}
      columns={gridColumns}
      showPagination={false}
    />);
  }
  return null;
};

class ParameterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modalData: { type: 'string', name: '' },
      validated: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.preventSpace = this.preventSpace.bind(this);
  }
  handleChangeSelect = (event, index, value) => {
    //this.setState({ modalData: { type: value } });
    this.setState((prevState) => {
      return { modalData: Object.assign({}, prevState.modalData, { type: value }) };
    });
  };
  handleOpen = () => {
    this.setState({ open: true, validated: false });
  }
  handleClose = () => {
    this.setState({ open: false });
  }
  handleSubmit = () => {
    this.props.addParameter({
      name: this.state.modalData.name,
      type: this.state.modalData.type,
      value: null
    });
  }
  preventSpace(e) {
    if (e.charCode === 32) {
      e.preventDefault();
    }
  }
  handleChange(e, fieldName) {
    const value = e.target.value;
    const nextState = {};
    //Validate if field is required
    if (value === '') {
      nextState[`${fieldName}_errorText`] = 'Campo Requerido';
    } else {
      nextState[`${fieldName}_errorText`] = '';
    }
    //Update associate validation state to field
    nextState[fieldName] = value;
    //this.setState({ modalData: nextState });

    this.setState((prevState) => {
      return { modalData: Object.assign({}, prevState.modalData, nextState) };
    });
    //Update validated form state
    if (this.state.modalData.name !== '') {
      this.setState({ validated: true });
    } else {
      this.setState({ validated: false });
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Guardar"
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
        disabled={!this.state.validated}
        onClick={this.handleSubmit}
      />,
    ];
    return (
      <div>
        {renderList(this.props.parameters)}
        <FlatButton
          label="Agregar Parámetro"
          labelPosition="before"
          secondary
          icon={<ContentAdd />}
          onTouchTap={this.handleOpen}
          style={style}
        />
        <Dialog
          title="Agregar Parámetro"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div>
            <TextField
              hintText="Nombre del Parámetro"
              errorText={this.state.modalData.name_errorText}
              floatingLabelText="Nombre"
              onChange={(e) => { this.handleChange(e, 'name'); }}
              onBlur={(e) => { this.handleChange(e, 'name'); }}
              onKeyPress={(e) => { this.preventSpace(e); }}
            />
            <br />
            <SelectField
              floatingLabelText="Tipo"
              value={this.state.modalData.type}
              onChange={this.handleChangeSelect}
              underlineShow={false}
            >
              <MenuItem value="string" primaryText="String" />
              <MenuItem value="int" primaryText="Int" />
              <MenuItem value="decimal" primaryText="Decimal" />
              <MenuItem value="date" primaryText="Date" />
            </SelectField>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ParameterList;
