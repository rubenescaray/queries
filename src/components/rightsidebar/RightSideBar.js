import React from 'react';
import { observer } from 'mobx-react';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { MuiTreeList } from 'react-treeview-mui';
//import FlatButton from 'material-ui/FlatButton';
//import Subheader from 'material-ui/Subheader';
import '../../styles/rightsidebar.css';
import Palette from '../../Palette';

const styles = {
  filterIconContainer: {
    backgroundColor: Palette.rightSideBar.backgroundColorDesktop,
  },
  filterIcon: {
    color: '#FFF',
    cursor: 'pointer',
  },
  rightSideBar: {
    backgroundColor: Palette.rightSideBar.backgroundColorDesktop,
  },
  titleSideBar: {
    fontSize: '12px',
    color: '#FFF',
    paddingTop: '40px',
    position: 'relative',
  },
  closeIcon: {
    color: '#FFF',
  },
  closeIconContainer: {
    right: 0,
    position: 'absolute',
    marginRight: '10px',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    zIndex: '9999',
  },
  clar: {
    clear: 'both',
  }
};

@observer
class RightSideBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      right: '-250px',
      open: false
    };

    this.identation = -1;
    this.arrItemPass = [];
  }

  openSideBar = () => {
    let rightPos;
    if (!this.state.open) {
      rightPos = '0px';
    } else {
      rightPos = '-250px';
    }
    this.setState({
      right: rightPos,
      open: !this.state.open
    });
  }

  handleTouchTap = (listItem, index) => {
    this.props.handleTouchTap(listItem, index);
  }

  removeFilter = () => {
    this.props.handleRemoveFilter();
  }

  makeTreeView = (arr, nodeType) => {
    if (nodeType === 'parent') {
      //console.log('arr.length', arr.length);
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (this.arrItemPass.indexOf(arr[i].name) < 0) {
            //console.log('aaaa', arr[i]);
            this.identation++;
            console.log(this.spaces(this.identation), `<${arr[i].name}>`);
            if (arr[i].children) {
              const cantChildren = arr[i].children.length;
              for (let j = 0; j < cantChildren; j++) {
                const indexChildren = arr[i].children[j];
                this.arrItemPass.push(arr[indexChildren].name);
                this.makeTreeView(arr[indexChildren], 'children');
              }
            }
            this.identation--;
            console.log(this.spaces(this.identation), `</${arr[i].name}>`);
          }
        }
      }
    }

    if (nodeType === 'children') {
      //console.log('entró en children');
      console.log(this.spaces(this.identation), `<${arr.name}>`);
      if (arr.children) {
        const cantChildren = arr.children.length;
        for (let k = 0; k < cantChildren; k++) {
          const indexChildren = arr.children[k];
          this.makeTreeView(arr[indexChildren], 'children');
        }
      }
      console.log(this.spaces(this.identation), `</${arr.name}>`);
    }
  }

  spaces = (indentation) => {
    return new Array(indentation + 1).join('    ');
  }

  render() {
    const arr = this.props.queryListStore.categories;
    if (arr.length > 0) {
      this.makeTreeView(arr, 'parent');
    }
    const calcRightPosition = {
      right: this.state.right
    };
    const extraStyleSideBar = Object.assign({}, styles.rightSideBar, calcRightPosition);
    //console.log('this.props.queryListStore.categories', this.props.queryListStore.categories);
    return (
      <nav id="rightsidebar" style={extraStyleSideBar}>
        <div className="rightsidebarbutton" onClick={this.openSideBar} style={styles.filterIconContainer}>
          <FilterIcon style={styles.filterIcon} />
        </div>
        <div>
          <div>
            <div style={styles.closeIconContainer}>
              <CloseIcon style={styles.closeIcon} onClick={this.openSideBar} />
            </div>
            <div style={styles.titleSideBar}>Seleccione una categoria para filtrar</div>
          </div>
          <MuiTreeList
            listItems={this.props.queryListStore.categories.slice()}
            expandedListItems={this.props.queryListStore.expandedTreeViewIndexs.slice()}
            activeListItem={this.props.queryListStore.activeTreeViewIndex}
            contentKey={'name'}
            useFolderIcons
            haveSearchbar={false}
            handleTouchTap={this.handleTouchTap}
            style={{ color: '#FFF' }}
          />
        </div>
      </nav>
    );
  }
}

export default RightSideBar;
