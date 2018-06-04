import React from 'react';
//import Paper from 'material-ui/Paper';
//import Menu from 'material-ui/Menu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import ActionList from 'material-ui/svg-icons/action/list';

/*
const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 0',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};
*/
/*
const LayoutMenu = () => {
  return (
    <div>
      <Paper style={style.paper}>
        <Menu>
          <MenuItem primaryText="Sources" leftIcon={<ActionList />} href="/app/sources/index" />
          <MenuItem primaryText="Queries" leftIcon={<ActionList />} href="/app/queries/index" />
          <MenuItem primaryText="Dashboard" leftIcon={<ActionList />} href="/app/dashboard" />
        </Menu>
      </Paper>
    </div>);
};
*/
const style = {
  color: '#FFFFFF',
};

const LayoutMenu = (props) => {
  return (
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      iconStyle={style}
    >
      <MenuItem primaryText="Origenes de Datos" leftIcon={<ActionList />} onClick={() => { props.router.push('/sources/index'); }} />
      <MenuItem primaryText="Consultas" leftIcon={<ActionList />} onClick={() => { props.router.push('/queries/index'); }} />
      <MenuItem primaryText="Dashboard" leftIcon={<ActionList />} onClick={() => { props.router.push('/dashboard/index'); }} />
    </IconMenu>
  );
};


export default LayoutMenu;

// <MenuItem primaryText="Tablero de Control" leftIcon={<ActionList />} onClick={() => { props.router.push('/dashboard'); }} />
