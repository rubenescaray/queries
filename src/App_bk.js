import React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Snackbar from 'material-ui/Snackbar';
import { inject, observer } from 'mobx-react';
import 'typeface-roboto/index.css';
import BackgroundImage from './images/bckg_login.jpg';
import './App.css';
import reactTableOverride from './components/table/ReactTableOverride';

injectTapEventPlugin();
reactTableOverride();

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto',
  palette: {
    //primary1Color: '#09427c',
    primary1Color: '#4171DE',
    accent1Color: '#999999'
  },
  textField: {
    textColor: '#000000',
    floatingLabelColor: '#212121',
    disabledTextColor: '#424242',
  },
  appBar: {
    height: 80,
    color: '#01579B',
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
    //padding: '10px 2em 0',
    height: document.documentElement.clientHeight
  },
  appBar: {
    zIndex: '3',
    position: 'fixed'
  },
  withMenu: {
    paddingTop: 80
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
            <AppBar
              style={style.appBar}
              showMenuIconButton={false}
              iconElementRight={menu}
              title={<img alt="logo" src="http://181.143.158.230/Consultas/build/static/media/brand.5e85c22e.png" />}
            />
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
