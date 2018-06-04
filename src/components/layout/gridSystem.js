import React from 'react';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  column: {
    display: 'flex',
    flexGrow: '1',
    flexBasis: '0',
    padding: '8px',
    alignItems: 'center'
  },
};

export const Column = (props) => { return (<div style={props.style ? props.style : style.column}>{props.children}</div>); };
export const Row = (props) => { return (<div style={style.container}>{props.children}</div>); };
