import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ParameterValues from '../parameter-values/ParameterValues';
import SelectFilter from '../select-filter/SelectFilter';
import GraphAxisDataMapper from '../widget/graphAxisDataMapping';

@observer
class WidgetEditor extends Component {
  onWidgetTypeChange = (event, key, value) => {
    this.props.handleChangeWidgetType(value);
  };
  handleChangeAxisDataSource = (axis, value) => {
    this.props.handleChangeWidgetGraphAxisDataSource(axis, value);
  }
  handleChangeAxisLegend = (axis, value) => {
    this.props.handleChangeWidgetGraphAxisLegend(axis, value);
  }
  renderWidgetType = (widgetType) => {
    switch (widgetType) {
    case 'GridWidget':
      return (
        <div>
          <h4>Parámetros</h4>
          <ParameterValues editingMode onlyLabelAndValue validationStore={this.props.validationStore} store={this.props.parameterValuesStore} />
          <h4>Campos involucrados en la consulta</h4>
          <SelectFilter store={this.props.selectFilterStore} updateCallback={this.props.updateGrid} onlyCheckAndLabel />
        </div>
      );
    case 'LineChartWidget':
    case 'BarChartWidget':
      return (
        <div>
          <h4>Parámetros</h4>
          <ParameterValues editingMode onlyLabelAndValue validationStore={this.props.validationStore} store={this.props.parameterValuesStore} />
          <GraphAxisDataMapper
            axisMappings={this.props.axisMappings}
            dashboardStore={this.props.dashboardStore}
            options={[]}
            handleChangeAxisDataSource={this.handleChangeAxisDataSource}
            handleChangeAxisLegend={this.handleChangeAxisLegend}
            store={null}
          />
        </div>
      );
    case 'PieChartWidget':
      return null;
    case 'GroupChartWidget':
      return null;
    default:
      return null;
    }
  }

  render() {
    return (
      <div>
        <TextField
          hintText="Título para el Widget"
          floatingLabelFixed
          floatingLabelText="Título"
          fullWidth
          onChange={(e) => { this.props.onHandleTitle(e); }}
          value={this.props.dashboardStore.widgetTitle}
        />
        <AutoComplete
          hintText="Nombre de la Consulta"
          floatingLabelFixed
          floatingLabelText="Nombre de la Consulta"
          fullWidth
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus
          dataSource={this.props.dataQuery}
          onNewRequest={this.props.onHandleChangeAutocomplete}
          searchText={this.props.dashboardStore.query !== undefined ? this.props.dashboardStore.query.name : ''}
        />
        <SelectField
          floatingLabelText="Tipo de widget"
          floatingLabelFixed
          value={this.props.widgetType}
          onChange={this.onWidgetTypeChange}
        >
          <MenuItem key={null} value={null} primaryText="" />
          <MenuItem value="GridWidget" primaryText="Grilla" />
          <MenuItem value="LineChartWidget" primaryText="Gráfico de línea" />
          <MenuItem value="BarChartWidget" primaryText="Gráfico de barras" />
          {/* <MenuItem value="PieChartWidget" primaryText="Gráfico de torta" />
          <MenuItem value="GroupChartWidget" primaryText="Gráfico de grupo" /> */}
        </SelectField>
        {this.renderWidgetType(this.props.widgetType)}
      </div>
    );
  }
}

export default WidgetEditor;
