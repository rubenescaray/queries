import React, { Component } from 'react';
import ReactTable from 'react-table';
import { inject, observer } from 'mobx-react';
import Utils from '../../../utils';
import './grid.css';
//import { queryService } from '../../../services/Services';
import GridStore from './stores/gridStore';
import { defineColumns } from '../../../components/table/columnsDefiner';
import SelectFilterStore from '../../../components/select-filter/stores/SelectFilterStore';

@inject('snackBarStore')
@inject('queryService')
@observer
class GridWidget extends Component {
  constructor(props) {
    super(props);
    this.containerDivId = Utils.getNewId();
    this.selectFilterStore = new SelectFilterStore();
    this.gridStore = new GridStore(this.props.queryService, props.snackbarStore);
    this.data = [];
    this.state = {};
    this.reactTableDivStyle = {
      height: '96%',
      overflowX: 'hidden',
      marginTop: '0px'
    };
    this.reactTableStyle = {
      height: '100%'
    };
  }

  componentDidMount = () => {
    this.gridStore.executeQueryById(this.props.queryId)
    .then(() => {
      this.selectFilterStore.mixSchemaWithSelects(this.gridStore.schema, this.gridStore.selects);
    });
  }

  onGridResize = () => {
  }

  render() {
    const results = this.gridStore.results.map((r) => { return Object.assign({}, r); });
    const tableResponsiveStyling = {
      getTableProps: () => {
        const tableStyle = { overflow: 'hidden', flex: '1 100%' };
        tableStyle.zIndex = '0';
        return { style: tableStyle };
      },
      getTrGroupProps: () => { return { style: { display: 'flex' } }; },
      getTheadProps: () => { return { style: { display: 'flex' } }; },
      getNoDataProps: () => { return { style: { padding: '0px' } }; },
      getPaginationProps: () => {
        const paginationStyle = {};
        paginationStyle['z-index'] = '0';
        return { style: paginationStyle };
      }
    };

    const columnsFilters = this.selectFilterStore.selects.filter((field) => {
      return field.include === true;
    });
    const columns = defineColumns(columnsFilters, results, this.gridStore.group.groupBy, this.gridStore.group.aggregation, this.gridStore.summary, true);

    return (
      // <div className="horizontal-table" style={this.reactTableDivStyle}>
      //   <ReactTable
      //     data={results}
      //     columns={columns}
      //     loading={this.gridStore.fetching}
      //     showPageJump={false}
      //     showPageSizeOptions={false}
      //     onResize={this.onGridResize}
      //     {...tableResponsiveStyling}
      //     style={this.reactTableStyle}
      //   />
      // </div>
      <ReactTable
        data={results}
        columns={columns}
        loading={this.gridStore.fetching}
        showPageJump={false}
        showPageSizeOptions={false}
        onResize={this.onGridResize}
        {...tableResponsiveStyling}
        style={this.reactTableStyle}
      />
    );
  }
}

export default GridWidget;
