import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import CloudDownloadIcon from 'material-ui/svg-icons/file/cloud-download';

const style = {
  border: '3px dashed #CCC',
  height: '22rem',
  width: '28rem',
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#EEE'
};

const TargetWidgetItemStyle = {
  cloudDownloadIcon: {
    width: 100,
    height: 100,
    color: '#AAA'
  },
  dragAndDropText: {
    fontSize: '2em',
    color: '#333',
    fontWeight: 'bold'
  }
};

const WidgetItemTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItemType());
  },
};

// @DropTarget([Array de Fuentes que pueden ser arrojadas al TargetBox])
// La fuente viene de SourceWidgetItem @DragSource((props) => { return props.type; }) //props.type es el tipo de Widget
@DropTarget(['GridWidget', 'LineChartWidget', 'BarChartWidget', 'PieChartWidget', 'GroupChartWidget'], WidgetItemTarget, (connect, monitor) => {
  return ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingColor: monitor.getItemType(),
  });
})

class TargetBox extends Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    //canDrop: PropTypes.bool.isRequired,
    //draggingColor: PropTypes.string,
    connectDropTarget: PropTypes.func.isRequired,
  }

  render() {
    const {
      //canDrop,
      isOver,
      //draggingColor,
      connectDropTarget,
    } = this.props;
    const opacity = isOver ? 1 : 0.7;

    //console.log('candrop', canDrop);
    //console.log('draggingColor', draggingColor);

    return connectDropTarget(
      <div style={{ ...style, opacity }}>
        <CloudDownloadIcon style={TargetWidgetItemStyle.cloudDownloadIcon} />
        {isOver && <p style={TargetWidgetItemStyle.dragAndDropText}>Suelte aquí el Widget</p>}
        {!isOver && <p style={TargetWidgetItemStyle.dragAndDropText}>Drag & Drop Widget.</p>}
      </div>
    );
  }
}

export default class StatefulTargetBox extends Component {

  handleDrop(widgetType) {
    this.props.widgetContainerStore.addWidgetItem(widgetType);
  }
  render() {
    //console.log('PROPIEDADES:', this.props);
    return (
      <TargetBox
        {...this.props}
        onDrop={(widgetType) => { this.handleDrop(widgetType); }}
      />
    );
  }
}
