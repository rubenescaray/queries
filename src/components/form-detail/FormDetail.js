import React from 'react';
import * as formatting from '../formatting/formatter';

const style = {
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  child: {
    flexGrow: '1',
    height: '100px',
    width: '20%',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  error: {
    fontWeight: 500
  }
};

const renderError = () => {
  return (<div style={style.error}><b>Las consultas de tipo detalle sólo pueden devolver un registro.</b></div>);
};

const renderFields = (data, schema) => {
  return (
  data.map((field) => {
    return Object.keys(field).map((key) => {
      const fieldSchema = schema.find((x) => { return x.name === key; });
      return (<div style={style.child}>
        <label style={style.label}>{key}</label>
        <label>{formatting[fieldSchema.type](field[key])}</label>
      </div>
      );
    });
  })
  );
};

const FormDetail = (props) => {
  if (props.data === null || props.schema === null) {
    return null;
  }
  return (
    <div style={style.container}>
      {props.data.length > 1 ?
          renderError() : renderFields(props.data, props.schema)
        }
    </div>
  );
};


export default FormDetail;
