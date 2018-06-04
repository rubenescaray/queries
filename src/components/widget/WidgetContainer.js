import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-table/react-table.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from './Widget';
import Utils from '../../utils';
import '../../styles/react-grid-layout.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const widgetContainerStyle = {
  gridLayout: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
  },
  divGridLayoutContainer: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '2px',
    width: '100%',
    marginTop: '10px',
    position: 'relative'
  },
  widgetItem: {
    marginLeft: '0px'
  }
};

@observer
class WidgetContainer extends Component {

  constructor(props) {
    super(props);
    this.gridLayoutId = Utils.getNewId();
  }

  onBreakpointChange = (breakpoint, cols) => {
    this.props.widgetContainerStore.breakpointChange(breakpoint, cols);
  };

  onLayoutChange = (layout) => {
    this.props.widgetContainerStore.layoutChange(layout);
  };

  onRemoveItem = (i) => {
    this.props.widgetContainerStore.removeWidgetItem(i);
  };

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // `oldLayoutItem` contains the state of the item before the resize.
    // You can modify `layoutItem` to enforce constraints.
    const layoutItemAux = layoutItem;
    const placeholderAux = placeholder;
    if (layoutItemAux.w < 4) {
      layoutItemAux.w = 4;
      placeholderAux.w = 4;
    }
    if (layoutItemAux.h < 4 || layoutItemAux.h > 4) {
      layoutItemAux.h = 4;
      placeholderAux.h = 4;
    }
  }

  createWidgetComponent = {
    gridTable: (props) => {
      return (
        <div key={props.i} data-grid={props.component} style={widgetContainerStyle.widgetItem}>
          <Widget title={'Grid Table Widget'} />
        </div>
      );
    },
    lineChart: (props) => {
      console.log(props);
      return (
        <div key={props.i} data-grid={props.component} style={widgetContainerStyle.widgetItem}>
          <Widget title={'Line Chart Widget'} />
        </div>
      );
    }
  };

  generateDOM = () => {
    return this.props.widgetContainerStore.widgetItems.map((widgetComponent, key, widgetItems) => {
      return (this.createWidgetComponent[widgetComponent.type](Object.assign({}, { i: widgetComponent.i, component: widgetComponent }, widgetItems)));
    });
  };

  render() {
    return (
      <div style={widgetContainerStyle.divGridLayoutContainer}>
        <ResponsiveReactGridLayout
          id={this.gridLayoutId}
          style={widgetContainerStyle.gridLayout}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          onResize={this.onResize}
          {...this.props.widgetContainerStore.widgetProps}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }

}

export default WidgetContainer;
