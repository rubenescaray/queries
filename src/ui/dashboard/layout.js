import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { inject, observer } from 'mobx-react';
import 'react-table/react-table.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Utils from '../../utils';
import WidgetContainer from './widgetContainer';
import GridWidget from './widgets/grid';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

@inject('snackBarStore') @observer
class DashboardLayout extends Component {

  constructor(props) {
    super(props);
    this.responsiveGridLayoutId = Utils.getNewId();
    this.widgetComponents = [];
    this.rowHeight = 400;
    this.widgets = [
      { type: 'gridWidget', queryId: 'd48e37db-2f56-4d0f-8563-43ee2a3b8fea', x: 0, y: 0, width: 2 },
      { type: 'gridWidget', queryId: 'd48e37db-2f56-4d0f-8563-43ee2a3b8fea', x: 2, y: 0, width: 1 },
      { type: 'gridWidget', queryId: 'd48e37db-2f56-4d0f-8563-43ee2a3b8fea', x: 0, y: 0, width: 3 }
    ].sort(this.compareWidgetsCoordinates);
    this.gridProps = {
      className: 'layout',
      cols: { lg: 3, md: 3, sm: 2, xs: 2, xxs: 1 },
      breakpoints: { lg: 1000, md: 900, sm: 768, xs: 480, xxs: 0 },
      measureBeforeMount: false,
      isDraggable: true,
      isResizable: true,
      rowHeight: this.rowHeight,
      onLayoutChange: () => { }
    };
    this.state = {
      isEditing: false,
      widgets: [],
      mounted: false,
      currentBreakpoint: 'lg',
      layouts: {
        lg: []
      },
      queries: []
    };
  }

  /*componentWillMount = () => {
    this.props.queryStore.fetch(true).then((queries) => {
      this.state.queries = queries;
    });
  }*/

  componentDidMount = () => {
    const layouts = this.generateLayout();
    this.gridProps.initialLayout = layouts;
    const breakpointLayouts = {};
    breakpointLayouts[this.state.currentBreakpoint] = layouts;
    this.setState({ layouts: Object.assign({}, this.state.layouts, breakpointLayouts) });
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  }

  onLayoutChange = (layout, layouts) => {
    this.gridProps.onLayoutChange(layout, layouts);
  };

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onResizeStart = (oldItem) => {
    this.resizeElementStartH = oldItem.h;
  }

  onResize = (oldItem) => {
    Object.assign(oldItem, { h: this.resizeElementStartH });
  }

  onResizeStop = (oldItem) => {
    Object.assign(oldItem, { h: this.resizeElementStartH });
  }

  generateLayout = () => {
    let index = 0;
    const generatedLayout = [];
    this.widgets.forEach((widget) => {
      const widgetProps = {
        layoutI: index,
        updateLayoutHeight: this.updateLayoutHeight,
        height: this.gridProps.rowHeight,
        key: index.toString()
      };
      const queryId = widget.queryId;
      widgetProps.queryId = queryId;
      const rows = 1;
      const columns = 1;
      const widgetLayout = { i: index.toString(), x: widget.x * columns, y: widget.y * rows, w: columns * widget.width, h: rows };
      generatedLayout.push(widgetLayout);
      this.widgetComponents.push({ type: widget.type, i: index, props: widgetProps });
      index++;
    });
    return generatedLayout;
  }

  generateDOM = () => {
    return this.widgetComponents.map((widgetComponentInfo) => {
      return (this.widgetsRenderings[widgetComponentInfo.type](Object.assign({}, { i: widgetComponentInfo.i }, widgetComponentInfo.props)));
    });
  }

  widgetsRenderings = {
    gridWidget: (props) => {
      const containerStyle = {
        //minHeight: this.rowHeight
      };
      return (<div key={props.i} style={containerStyle}><WidgetContainer title={'Grid Widget'}><GridWidget {...props} /></WidgetContainer></div>);
    }
  }

  compareWidgetsCoordinates = (a, b) => {
    if (b.x < a.x) {
      if (b.y <= a.y) {
        return 1;
      }
      return -1;
    }
    if (b.x > a.x) {
      if (b.y < a.y) {
        return 1;
      }
      return -1;
    }
    if (b.x === a.x) {
      if (b.y < a.y) {
        return 1;
      }
      return -1;
    }
    return 0;
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    return (
      <ResponsiveReactGridLayout
        id={this.responsiveGridLayoutId}
        {...this.gridProps}
        layouts={this.state.layouts}
        onBreakpointChange={this.onBreakpointChange}
        onLayoutChange={this.onLayoutChange}
        useCSSTransforms={this.state.mounted}
        onResizeStart={this.onResizeStart}
        onResize={this.onResizeStart}
        onResizeStop={this.onResizeStop}
      >
        {this.generateDOM()}
      </ResponsiveReactGridLayout>
    );
  }
}

export default DashboardLayout;

