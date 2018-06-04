import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const GenericGridWidget = (props) => {
  const predefinedColumns = [{
    Header: 'Column 1',
    accessor: 'column1' // String-based value accessors!
  }, {
    Header: 'Column 2',
    accessor: 'column2'
  }];
  const predefinedData = [{
    column2: 'Data 2',
    column1: 'Data 1'
  }];
  const columns = (props.columns.length > 0) ? props.columns : predefinedColumns;
  const data = (props.results.length > 0) ? props.results.slice() : predefinedData;
  return (
    <ReactTable
      data={data}
      columns={columns}
      style={{ backgroundColor: '#FFF', color: '#000' }}
      showPageSizeOptions={false}
      loading={props.fetching}
      previousText="« Ant"
      nextText="Sig »"
    />
  );
};

@observer
class GridWidget extends Component {

  render() {
    const { selectFilterStore, dashboardStore } = this.props;
    //console.log('selectFilterStore.selects', selectFilterStore.selects.length);
    let columnsFilters;
    if (selectFilterStore.selects.length > 0) {
      columnsFilters = selectFilterStore.selects.filter((field) => {
        return field.include === true;
      });
    } else {
      columnsFilters = dashboardStore.query !== undefined ? dashboardStore.query.selects : [];
    }
    const columns = [];
    if (columnsFilters.length > 0) {
      columnsFilters.forEach((column) => {
        columns.push(
          {
            Header: (column.label !== '') ? column.label : column.name,
            accessor: column.name
          }
        );
      });
    }
    return (
      <GenericGridWidget columns={columns} {...dashboardStore} />
    );
  }
}

export default GridWidget;
