import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { observer, inject } from 'mobx-react';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite-border';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import SourceIcon from 'material-ui/svg-icons/action/dns';
import QueryIcon from 'material-ui/svg-icons/action/chrome-reader-mode';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import QSISEIcon from 'material-ui/svg-icons/action/class';
import styled from 'styled-components';
import Palette from '../../Palette';
import TopBarStore from './stores/TopBarStore';
//import LoginStore from '../../ui/login/stores/LoginStore';
import TopBarLogo from './../../images/logo_topbardesk.png';
import MiniTopBarLogo from './../../images/logo_topbarmob.png';
import { authService } from '../../services/Services';

const LogoArea = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (max-width: 767.99px) {
    width: 60px;
    background-image: url(${MiniTopBarLogo});
    background-repeat: no-repeat;
    background-position: 14px 12px;
  }

  // Large devices (laptos, desktops, more than 1024px)
  @media only screen
    and (min-width: 768px) {
      width: 210px;
      background-image: url(${TopBarLogo});
      background-repeat: no-repeat;
      background-position: 27px 8px;
  }
`;

const MenuIconArea = styled.div`
  // Large devices (laptos, desktops, more than 1024px)
  @media only screen
    and (min-width: 1024px) {
      //border: 1px solid red;
  }
`;

const ExtraIconsArea = styled.div`
  // Large devices (laptos, desktops, more than 1024px)
  @media only screen
    and (min-width: 1024px) {
      //border: 1px solid red;
  }
`;

const styles = {
  wrapper: {
    height: '50px',
    backgroundColor: Palette.topBar.topBarColor,
    width: '100%',
    boxShadow: '1px 1px 10px #777',
    position: 'fixed',
    zIndex: '9999',
    top: 0,
  },
  logoArea: {
    float: 'left',
    padding: '8px',
    height: '50px',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: Palette.topBar.backgroundColorLogo
  },
  menuIconArea: {
    float: 'left',
    height: '50px',
    position: 'relative'
  },
  extraIconsArea: {
    float: 'right',
    height: '50px',
    marginRight: '10px'
  },
  containerIcon: {
    padding: '12px 10px',
    float: 'left'
  },
  icons: {
    color: '#FFF',
    cursor: 'pointer'
  },
  powerIcon: {
    color: '#ee693d',
    cursor: 'pointer'
  },
  drawer: {
    //paddingTop: 100,
  },
  iconAndTitle: {
    display: 'flex',
    cursor: 'pointer',
    color: '#FFF',
    height: 70,
    fontSize: '18px',
    boxSizing: 'border-box',
  },
  leftSidebarItemTitle: {
    marginLeft: 15,
    height: 70,
    paddingTop: 10,
    boxSizing: 'border-box',
  },
  leftSidebarItemIcon: {
    height: 70,
    paddingTop: 15,
    boxSizing: 'border-box',
  }
};

@inject('snackBarStore')
@observer
class TopBar extends React.Component {

  constructor(props) {
    super(props);
    this.topBarStore = new TopBarStore(authService, this.props.snackbarStore);
    this.state = {
      open: false
    };
  }

  leftSideBarHandler = () => {
    console.log('SIII');
    this.setState({ open: true });
  }

  goToSource = () => {
    this.props.router.push('/sources/index');
    this.setState({ open: false });
  }

  goToQuery = () => {
    this.props.router.push('/queries/index');
    this.setState({ open: false });
  }

  goToDashboard = () => {
    this.props.router.push('/dashboard/index');
    this.setState({ open: false });
  }

  goToQSISE = () => {
    this.setState({ open: false });
  }

  handleLogout = () => {
    this.topBarStore.logout('token').then(() => {
      this.props.router.push('/login');
    })
    .catch((error) => {
      this.props.snackBarStore.setMessage(error);
    });
  }

  render() {
    //const calcLeftIcon = { };
    //const styleMenuIcon = Object.assign({}, styles.menuIconArea, calcLeftIcon);
    return (
      <div style={styles.wrapper}>
        <LogoArea style={styles.logoArea} />
        <MenuIconArea style={styles.menuIconArea}>
          <div style={styles.containerIcon}>
            <MenuIcon style={styles.icons} onClick={this.leftSideBarHandler} />
          </div>
        </MenuIconArea>
        <ExtraIconsArea style={styles.extraIconsArea}>
          <div style={styles.containerIcon}>
            <SearchIcon style={styles.icons} />
          </div>
          <div style={styles.containerIcon}>
            <FavoriteIcon style={styles.icons} />
          </div>
          <div style={styles.containerIcon}>
            <PowerIcon onClick={() => { this.handleLogout(); }} style={styles.powerIcon} />
          </div>
        </ExtraIconsArea>
        <Drawer
          docked={false}
          open={this.state.open}
          style={styles.drawer}
          onRequestChange={(open) => { this.setState({ open }); }}
        >
          <div style={{ marginTop: 90 }}>
            <MenuItem onClick={this.goToSource}>
              <div style={styles.iconAndTitle}>
                <div style={styles.leftSidebarItemIcon}>
                  <SourceIcon style={styles.icons} />
                </div>
                <div style={styles.leftSidebarItemTitle}>
                  Orígenes de Datos
                </div>
              </div>
            </MenuItem>
            <MenuItem onClick={this.goToQuery}>
              <div style={styles.iconAndTitle}>
                <div style={styles.leftSidebarItemIcon}>
                  <QueryIcon style={styles.icons} />
                </div>
                <div style={styles.leftSidebarItemTitle}>
                  Consultas
                </div>
              </div>
            </MenuItem>
            <MenuItem onClick={this.goToDashboard}>
              <div style={styles.iconAndTitle}>
                <div style={styles.leftSidebarItemIcon}>
                  <DashboardIcon style={styles.icons} />
                </div>
                <div style={styles.leftSidebarItemTitle}>
                  Dashboard
                </div>
              </div>
            </MenuItem>
            <MenuItem onClick={this.goToQSISE}>
              <div style={styles.iconAndTitle}>
                <div style={styles.leftSidebarItemIcon}>
                  <QSISEIcon style={styles.icons} />
                </div>
                <div style={styles.leftSidebarItemTitle}>
                  qSISE
                </div>
              </div>
            </MenuItem>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default TopBar;
