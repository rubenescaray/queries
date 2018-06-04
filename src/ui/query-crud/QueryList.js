import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
//import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ShareIcon from 'material-ui/svg-icons/social/share';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { inject, observer } from 'mobx-react';
import '../../styles/react-table.css';
import Palette from '../../Palette';
import RightSideBar from '../../components/rightsidebar/RightSideBar';

const styles = {
  actionIcon: {
    color: Palette.table.actionIconColor,
    margin: '0px 10px',
    cursor: 'pointer',
  },
  addButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  actionIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  filterButton: {
    margin: 0,
    top: 300,
    right: 0,
    position: 'fixed',
    zIndex: 1000,
    //borderRadius: 0,
  }
};

/*const ExecuteQueryComponent = (props) => {
  return <FlatButton label="Ejecutar" primary onClick={props.metadata.showExecute.bind(this, props.rowData.original)} />;
};

const EditQueryComponent = (props) => {
  return <FlatButton label="Editar" primary onClick={props.metadata.showEdit.bind(this, props.rowData.original)} />;
};*/

const IconPreviewComponent = (props) => {
  return <VisibilityIcon onClick={props.metadata.showExecute.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconEditComponent = (props) => {
  return <ModeEditIcon onClick={props.metadata.showEdit.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconFavoriteComponent = (props) => {
  return <FavoriteBorderIcon onClick={props.metadata.favoriteAction.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

const IconShareComponent = (props) => {
  return <ShareIcon onClick={props.metadata.shareAction.bind(this, props.rowData.original)} style={styles.actionIcon} />;
};

@inject('queryListStore')
@observer
class QueryList extends Component {
  componentDidMount() {
    this.props.queryListStore.fetch();
    this.props.queryListStore.fetchCategories();
  }
  showAdd = () => {
    this.props.router.push('/queries/create');
  }
  showExecute = (query) => {
    this.props.router.push(`/queries/execute/${query.id}/${query.hasRequiredParameters}`);
  }
  showEdit = (query) => {
    this.props.router.push(`/queries/edit/${query.id}`);
  }
  favoriteAction = (source) => {
    console.log(source.id);
  }
  shareAction = (source) => {
    console.log(source.id);
  }
  showFilterTree = () => {
    this.props.queryListStore.setOpenMenu(!this.props.queryListStore.openMenu);
  }
  pageChange = (currentPage) => {
    this.props.queryListStore.setCurrentPage(currentPage);
  }
  handleTouchTap = (listItem, index) => {
    console.log('ENTRANDO', listItem);
    console.log('ENTRANDO 2', index);
    console.log('this.props.queryListStore.expandedTreeViewIndexs', this.props.queryListStore.expandedTreeViewIndexs);
    if (listItem.children) {
      console.log('1');
      const indexOfListItemInArray = this.props.queryListStore.expandedTreeViewIndexs.indexOf(index);
      console.log('indexOfListItemInArray', indexOfListItemInArray);
      if (indexOfListItemInArray === -1) {
        console.log('2');
        this.props.queryListStore.addIndexToTreeViewIndexs(index);
      } else {
        console.log('3');
        this.props.queryListStore.removeIndexFromTreeViewIndex(index);
      }
    } else {
      console.log('4');
      this.props.queryListStore.setActiveTreeViewItem(index, listItem.name);
    }
  }
  removeFilter = () => {
    this.props.queryListStore.setActiveTreeViewItem(-1, null);
  }
  requestChange = (open) => {
    this.props.queryListStore.setOpenMenu(open);
  }
  render() {
    //const customExecuteComponentMetadata = { showExecute: this.showExecute };
    //const customEditComponentMetadata = { showEdit: this.showEdit };
    const customExecuteComponentMetadata = { showExecute: this.showExecute };
    const customEditComponentMetadata = { showEdit: this.showEdit };
    const customFavoriteComponentMetadata = { favoriteAction: this.favoriteAction };
    const customShareComponentMetadata = { shareAction: this.shareAction };

    const columns = [{
      Header: 'NOMBRE',
      accessor: 'name',
    }, {
      Header: 'DESCRIPTCION',
      accessor: 'description',
    }, /*{
      Header: 'Source Name',
      accessor: 'sourceName',
    }, */{
      Header: 'ACCIONES',
      maxWidth: 250,
      Cell: (row) => {
        if (!row.aggregated) {
          return (
            <div style={styles.actionIconContainer}>
              <IconPreviewComponent metadata={customExecuteComponentMetadata} rowData={row} />
              <IconEditComponent metadata={customEditComponentMetadata} rowData={row} />
              <IconFavoriteComponent metadata={customFavoriteComponentMetadata} rowData={row} />
              <IconShareComponent metadata={customShareComponentMetadata} rowData={row} />
            </div>
          );
        }

        return (null);
      }
    }
    ];
    return (
      <div>
        <RightSideBar
          queryListStore={this.props.queryListStore}
          handleTouchTap={this.handleTouchTap}
          handleRemoveFilter={this.removeFilter}
        />
        <ReactTable
          page={this.props.queryListStore.currentPage}
          loading={this.props.queryListStore.fetching}
          data={this.props.queryListStore.filteredQueries}
          columns={columns}
          onPageChange={this.pageChange}
          previousText="« Ant"
          nextText="Sig »"
        />
        <FloatingActionButton style={styles.addButton} onClick={this.showAdd}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default QueryList;
