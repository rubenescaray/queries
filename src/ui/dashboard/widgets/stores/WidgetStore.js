import { observable } from 'mobx';
import Utils from '../../../../utils';

class WidgetStore {
  @observable widgetItems = [];
  // We're using the cols to calculate where to add new items.
  @observable breakPoint;
  @observable cols;
  @observable layout;

  widgetTypes = {
    GRID_TABLE: 'gridTable',
    LINE_CHART: 'lineChart'
  };

  constructor() {
    this.widgetProps = {
      className: 'layout',
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 100
    };
  }

  addWidgetItem = (widgetType) => {
    const newWidget = {
      i: Utils.getNewId(),
      x: (this.getWidgetCount() * 4) % (this.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 4,
      h: 4,
      type: widgetType
    };
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

export default WidgetStore;
