import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const SourceWidgetItemStyle = {
  itemContainer: {
    cursor: 'move',
    boxShadow: '0px 10px 3px -10px black',
    padding: '5px 0',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: '30px',
    marginBottom: '5px',
  },
  iconWidget: {
    float: 'left',
    padding: 5
  },
  textContainer: {
    width: 190
  },
  primaryText: {
    fontSize: '0.875em',
    paddingTop: '9px',
  },
  secondaryText: {
    fontSize: '0.75em',
    color: 'rgba(0,0,0,0.54)',
    margin: '4px 0',
    lineHeight: '18px'
  }
};

const WidgetItemSource = {
  canDrag() {
    return true;
  },

  beginDrag() {
    return {};
  },
};

// @DragSource(props => Fuente que está siendo arrastrada)
// @DropTarget en TargetBox verificará si está fuente puede ser soltada en la caja
@DragSource((props) => { return props.type; }, WidgetItemSource, (connect, monitor) => {
  return ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  });
})
class SourceBox extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const {
      isDragging,
      connectDragSource
    } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    const backgroundColor = isDragging ? '#EEE' : '#CCC';

    return connectDragSource(
      <div
        style={{
          ...SourceWidgetItemStyle.itemContainer,
          backgroundColor,
          opacity
        }}
      >
        <div style={{ paddingLeft: '15px' }}>
          <div style={SourceWidgetItemStyle.iconWidget}>
            {this.props.children}
          </div>
          <div style={SourceWidgetItemStyle.textContainer}>
            <div style={SourceWidgetItemStyle.primaryText}>{this.props.primaryText}</div>
            {/*<p style={SourceWidgetItemStyle.secondaryText}>
              {this.props.secondaryText}
            </p>*/}
          </div>
        </div>
      </div>,
    );
  }
}
export default class StatefulSourceBox extends Component {
  render() {
    return (
      <SourceBox
        {...this.props}
      />
    );
  }
}
