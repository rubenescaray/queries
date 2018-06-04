import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { DropTarget } from 'react-dnd';
import { Responsive } from 'react-grid-layout';
import 'react-table/react-table.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import CloudDownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import Widget from './Widget';
import Utils from '../../utils';
import '../../styles/react-grid-layout.css';
import '../../styles/dashboard.css';
import ComposedWidthProvider from './ComposedWidthProvider';

const ResponsiveReactGridLayout = ComposedWidthProvider(Responsive);

const widgetContainerStyle = {
  gridLayout: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    width: '100%'
  },
  divGridLayoutContainer: {
    color: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    borderRadius: '2px',
    width: '100%',
    position: 'relative'
  },
  cloudDownloadIcon: {
    width: 100,
    height: 100,
    color: '#AAA'
  },
  dragAndDropText: {
    fontSize: '2em',
    color: '#333',
    fontWeight: 'bold'
  },
  targetBox: {
    border: '3px dashed #CCC',
    height: '250px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#EEE',
    transform: 'translate(10px, 10px)',
    marginBottom: 10
  }
};

const WidgetItemTarget = {
  drop(props, monitor) {
    props.widgetContainerStore.addWidgetItem(monitor.getItemType());
  },
};

@DropTarget(['GridWidget', 'LineChartWidget', 'BarChartWidget', 'PieChartWidget', 'GroupChartWidget'], WidgetItemTarget, (connect, monitor) => {
  return ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingColor: monitor.getItemType(),
  });
})
@observer
class WidgetContainer extends Component {

  constructor(props) {
    super(props);
    this.gridLayoutId = Utils.getNewId();
    this.props.widgetContainerStore.widgetProps.isDraggable = this.props.widgetContainerBehavior.isDraggable;
    this.props.widgetContainerStore.widgetProps.isResizable = this.props.widgetContainerBehavior.isResizable;
  }

  onBreakpointChange = (breakpoint, cols) => {
    this.props.widgetContainerStore.breakpointChange(breakpoint, cols);
  };

  onLayoutChange = (layout) => {
    //console.log('LAYOUT onlayout', layout);
    const oldLayout = this.props.widgetContainerStore.oldLayout;
    const widgetLayouts = this.props.widgetContainerStore.widgetLayouts;
    this.props.widgetContainerStore.layoutTaken = layout;
    if (oldLayout !== undefined) {
      this.props.widgetContainerStore.layoutChange(oldLayout, layout);
    } else if (widgetLayouts.length > 0) {
      this.props.widgetContainerStore.layoutChange(widgetLayouts, layout);
    } else {
      this.props.widgetContainerStore.layoutChange(layout);
    }
  };

  onResize = (layout, oldLayoutItem, layoutItem, placeholder) => {
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
    //this.props.widgetContainerStore.setOldLayouts(layout);
    this.props.widgetContainerStore.oldLayout = layout;
  }

  generateDOM = () => {
    return this.props.widgetContainerStore.widgetItems.map((widgetComponent, index, widgetItems) => {
      return (
        <div key={widgetComponent.i} data-grid={widgetComponent} style={widgetContainerStyle.widgetItem}>
          <Widget
            dataWidget={widgetComponent}
            index={index}
            widgetContainerBehavior={this.props.widgetContainerBehavior}
            widgetItems={widgetItems}
            widgetContainerStore={this.props.widgetContainerStore}
            widgetMode={this.props.mode}
          />
        </div>
      );
    });
  };

  render() {
    const {
      isOver,
      connectDropTarget,
    } = this.props;
    const opacity = isOver ? 1 : 0.7;

    if (this.props.widgetContainerBehavior.isEditable) {
      return connectDropTarget(
        <div style={widgetContainerStyle.divGridLayoutContainer}>
          {this.props.widgetContainerStore.widgetItems.length === 0 &&
          <div className="target-box" style={{ ...widgetContainerStyle.targetBox, opacity }}>
            <CloudDownloadIcon style={widgetContainerStyle.cloudDownloadIcon} />
            {isOver && <p style={widgetContainerStyle.dragAndDropText}>Suelte aquí el Widget</p>}
            {!isOver && <p style={widgetContainerStyle.dragAndDropText}>Arrastre y suelte aquí el Widget.</p>}
          </div>}
          <ResponsiveReactGridLayout
            layouts={this.props.widgetContainerStore.oldLayouts}
            ref={(node) => { this.node = node; }}
            {...this.props.widgetContainerStore.widgetProps}
            onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}
            onResize={this.onResize}
            id={this.gridLayoutId}
            style={widgetContainerStyle.gridLayout}
          >
            {this.generateDOM()}
          </ResponsiveReactGridLayout>
        </div>
      );
    }

    // execution mode
    return (
      <div style={widgetContainerStyle.divGridLayoutContainer}>
        <ResponsiveReactGridLayout
          ref={(node) => { this.node = node; }}
          {...this.props.widgetContainerStore.widgetProps}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          onResize={this.onResize}
          id={this.gridLayoutId}
          style={widgetContainerStyle.gridLayout}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }

}

export default WidgetContainer;
