import React from 'react';
//import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Snackbar from 'material-ui/Snackbar';
import { inject, observer } from 'mobx-react';
import 'typeface-roboto/index.css';
import BackgroundImage from '././images/bckg_login.jpg';
import './App.css';
import reactTableOverride from './components/table/ReactTableOverride';
import Palette from './Palette';
import TopBar from './components/topbar/TopBar';

injectTapEventPlugin();
reactTableOverride();

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto',
  palette: Palette.palette,
  textField: {
    textColor: '#000000',
    floatingLabelColor: '#212121',
    disabledTextColor: '#424242',
  },
  appBar: {
    height: 80,
    color: Palette.topBar.topBarColor
  },
  tabs: {
    backgroundColor: Palette.tabs.backgroundColor,
    textColor: Palette.tabs.textColor,
    selectedTextColor: Palette.tabs.selectedTextColor,
  },
  drawer: {
    color: Palette.leftSideBar.backgroundColor,
  },
  floatingActionButton: {
    color: Palette.palette.floatingActionButtonBackgroundColor,
    borderRadius: 0,
  },
  icon: {
    color: '#FFF',
    //backgroundColor: palette.primary1Color,
  },
  datePicker: {
    color: Palette.primary1Color,
    textColor: Palette.primary1Color,
    calendarTextColor: Palette.primary1Color,
    selectColor: Palette.primary1Color,
    selectTextColor: Palette.primary1Color,
    calendarYearBackgroundColor: Palette.primary1Color,
    headerColor: Palette.primary1Color,
  },
});

const style = {
  container: {
    position: 'relative',
    textAlign: 'center'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
  page: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#000',
    backgroundSize: 'cover',
    display: 'flex',
    height: document.documentElement.clientHeight
  },
  appBar: {
    zIndex: '3',
    position: 'fixed'
  },
  withMenu: {
    paddingTop: 48
  }
};


@inject('snackBarStore')
@inject('loaderStore')
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { content, menu } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          {menu ?
            <TopBar router={this.props.router} />
          :
            null
          }
          <div className="page" style={menu ? style.withMenu : style.page}>
            <div className="content">
              { this.props.loaderStore.loading &&
                <div style={style.container}>
                  <RefreshIndicator
                    size={40}
                    left={10}
                    top={0}
                    status="loading"
                    style={style.refresh}
                  />
                </div>
              }
              {content}
              <Snackbar
                open={this.props.snackBarStore.isOpen}
                message={this.props.snackBarStore.message}
                autoHideDuration={10000}
                onRequestClose={this.props.snackBarStore.handleRequestClose}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;
