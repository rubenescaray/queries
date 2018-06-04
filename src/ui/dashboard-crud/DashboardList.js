import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
//import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
//import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ShareIcon from 'material-ui/svg-icons/social/share';
import '../../styles/react-table.css';
import Palette from '../../Palette';

/*const dashboardListStyle = {
  addDashboardButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  listButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};*/

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
  }
};


/*const LinkExecuteComponent = (props) => {
  return <FlatButton label="Ejecutar" primary onClick={props.metadata.goToExecute.bind(this, props.rowData.original)} />;
};

const LinkEditComponent = (props) => {
  return <FlatButton label="Editar" primary onClick={props.metadata.goToEdit.bind(this, props.rowData.original)} />;
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

@inject('dashboardListStore')
@observer
class DashboardList extends Component {
  componentDidMount() {
    //console.log('this.props.dashboardListStore:', this.props.dashboardListStore);
    //console.log('this.props.dashboardListStore.dataForList:', this.props.dashboardListStore.dataForList);
    this.props.dashboardListStore.fetch(false);
  }

  pageChange = (currentPage) => {
    this.props.dashboardListStore.setCurrentPage(currentPage);
  };

  showAdd = () => {
    this.props.router.push('/dashboard/create');
  };

  showExecute = (dashboard) => {
    this.props.router.push(`/dashboard/managedashboard/${dashboard.id}/isediting/false`);
  };

  showEdit = (dashboard) => {
    this.props.router.push(`/dashboard/managedashboard/${dashboard.id}/isediting/true`);
  };

  favoriteAction = (source) => {
    console.log(source.id);
  }
  shareAction = (source) => {
    console.log(source.id);
  }

  render() {
    const dataDashboard = this.props.dashboardListStore.dataForList.length > 0 ?
      this.props.dashboardListStore.dataForList : [];
    //console.log('dataDashboard DATATYPE', typeof dataDashboard);
    //console.log('dataDashboard stringify', JSON.stringify(dataDashboard));
    //const previewDashboardButton = { goToExecute: this.goToExecute };
    //const editDashboardButton = { goToEdit: this.goToEdit };
    const customExecuteComponentMetadata = { showExecute: this.showExecute };
    const customEditComponentMetadata = { showEdit: this.showEdit };
    const customFavoriteComponentMetadata = { favoriteAction: this.favoriteAction };
    const customShareComponentMetadata = { shareAction: this.shareAction };

    const columns = [
      {
        Header: 'Id',
        accessor: 'id',
        show: false
      }, {
        Header: 'NOMBRE',
        accessor: 'name'
      }, {
        Header: 'DESCRIPCION',
        accessor: 'description'
      },
      /*{
        Header: 'Widgets',
        accessor: 'widgetNames'
      },*/ {
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
        {
          <ReactTable
            page={this.props.dashboardListStore.currentPage}
            loading={this.props.dashboardListStore.fetching}
            data={dataDashboard}
            columns={columns}
            onPageChange={this.pageChange}
            previousText="« Ant"
            nextText="Sig »"
          />
        }
        <FloatingActionButton style={styles.addButton} onClick={this.showAdd}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default DashboardList;
