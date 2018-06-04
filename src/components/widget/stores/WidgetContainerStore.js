import { observable } from 'mobx';
import Utils from '../../../utils';

class Widget {

  constructor(i, xPos, yPos, width, height, widgetType) {
    this.i = i;
    this.x = xPos;
    this.y = yPos;
    this.w = width;
    this.h = height;
    this.type = widgetType;
  }
}

class WidgetContainerStore {
  @observable widgetItems = [];
  // We're using the cols to calculate where to add new items.
  breakPoint;
  @observable cols;
  @observable layout;

  widgetTypes = {
    GRID_TABLE: 'gridTable',
    LINE_CHART: 'lineChart'
  };

  // Numbers here are represented by the number of grid between 1 and 12 spaces (It's like bootstrap grid)
  widgetDimensions = {
    minWidth: 4,
    minHeight: 4,
    maxWidth: 12,
    maxHeight: 4
  };

  constructor() {
    this.widgetProps = {
      className: 'layout',
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 100
    };
  }

  addWidgetItem = (widgetType) => {
    const newWidget = new Widget(Utils.getNewId(), (this.getWidgetCount() * 4) % (this.cols || 12), Infinity, 4, 4, widgetType);
    this.widgetItems.push(newWidget);
  };

  getWidgetCount = () => {
    return this.widgetItems.length;
  };

  breakpointChange = (breakpoint, cols) => {
    this.breakPoint = breakpoint;
    this.cols = cols;
  };

  layoutChange = (layout) => {
    this.layout = layout;
  };

  removeWidgetItem = (widgetItemId) => {
    const items = this.widgetItems.filter((item) => {
      return item.i !== widgetItemId;
    });
    this.widgetItems = items;
  };
}

export default WidgetContainerStore;
