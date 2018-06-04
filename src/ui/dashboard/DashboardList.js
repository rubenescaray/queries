import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const dashboardListStyle = {
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
};

const LinkPreviewComponent = (props) => {
  return <FlatButton label="Vista Previa" primary onClick={props.metadata.showPreview.bind(this, props.rowData.original)} />;
};

const LinkEditComponent = (props) => {
  return <FlatButton label="Editar" primary onClick={props.metadata.showEdit.bind(this, props.rowData.original)} />;
};

@inject('dashboardListStore')
@observer
class DashboardList extends Component {
  componentDidMount() {
    this.props.dashboardListStore.fetch(false);
  }

  pageChange = (currentPage) => {
    this.props.dashboardListStore.setCurrentPage(currentPage);
  };

  showAdd = () => {
    this.props.router.push('/dashboard/create');
  };

  showPreview = (source) => {
    this.props.router.push(`/dashboard/preview/${source.id}`);
  };

  showEdit = (source) => {
    this.props.router.push(`/dashboard/edit/${source.id}`);
  };

  render() {
    const dataDashboard = this.props.dashboardListStore.dashboards.length > 0 ?
       this.props.dashboardListStore.dashboards : [];
    const previewDashboardButton = { showPreview: this.showPreview };
    const editDashboardButton = { showEdit: this.showEdit };
    const columns = [
      {
        Header: 'Id',
        accessor: 'id',
        show: false
      }, {
        Header: 'Name',
        accessor: 'name'
      }, {
        Header: 'Description',
        accessor: 'description'
      }, {
        Header: '',
        Cell: (row) => {
          if (!row.aggregated) {
            return (
              <div style={dashboardListStyle.listButtonContainer}>
                <LinkPreviewComponent metadata={previewDashboardButton} rowData={row} />
                <LinkEditComponent metadata={editDashboardButton} rowData={row} />
              </div>
            );
          }
          return (null);
        }
      }
    ];
    return (
      <div>
        <h2>Dashboards</h2>
        {
          <ReactTable
            page={this.props.dashboardListStore.currentPage}
            loading={this.props.dashboardListStore.fetching}
            data={dataDashboard}
            columns={columns}
            onPageChange={this.pageChange}
          />
        }
        <FloatingActionButton style={dashboardListStyle.addDashboardButton} onClick={this.showAdd}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default DashboardList;
