import { observable } from 'mobx';
import Utils from '../../../utils';
import * as GraphicRepresentation from '../GraphicRepresentation';

class Widget {

  @observable widgetTitle = 'A title';
  x;
  y;
  w;
  h;
  @observable widgetType;
  @observable graph = {};
  @observable queryId = '';
  positionsAndDimensionsLayout = {};
  position;
  dimensions;
  queryParameters = [];

  constructor(i, xPos, yPos, width, height, widgetType, graph) {
    this.i = i;
    this.x = xPos;
    this.y = yPos;
    this.w = width;
    this.h = height;
    this.widgetType = widgetType;
    this.graph = graph || GraphicRepresentation[widgetType];
    this.position = { x: xPos, y: yPos };
    this.dimensions = { width: this.w, height: this.h };
    this.positionsAndDimensionsLayout = { position: this.position, dimensions: this.dimensions };
  }

  setWidgetTitle = (title) => {
    this.widgetTitle = title;
  };

  setQueryId = (queryId) => {
    this.queryId = queryId;
  };

  setPosition = (x, y) => {
    this.position = { x, y };
  };

  setDimensions = (width, height) => {
    this.dimensions = { width, height };
  };
  setWidgetGraphAxisLegend = (widget, axisName, legend) => {
    if (widget) {
      const widgetGraph = widget.graph;
      const axis = GraphicRepresentation.findAxisByName(widgetGraph, axisName);
      if (axis) {
        axis.legend = legend;
      }
    }
  }

  setWidgetGraphAxisDataSource = (widget, axisName, dataSource) => {
    if (widget) {
      const widgetGraph = widget.graph;
      const axis = GraphicRepresentation.findAxisByName(widgetGraph, axisName);
      if (axis) {
        axis.dataSource = dataSource;
      }
    }
  }

  setQueryParameters = (parameters) => {
    this.queryParameters = parameters;
  };
}

class WidgetContainerStore {
  @observable widgetItems = [];
  @observable widgetTitles = [];
  // We're using the cols to calculate where to add new items.
  breakPoint;
  @observable cols = 12;
  @observable layout;
  oldLayout = [];
  oldLayouts = {};
  layoutTaken = [];
  widgetLayouts = [];

  widgetTypes = {
    GRID_TABLE: 'GridWidget',
    LINE_CHART: 'LineChartWidget',
    BAR_CHART: 'BarChartWidget',
    PIE_CHART: 'PieChartWidget',
    GROUP_CHART: 'GroupChartWidget'
  };

  // Numbers here are represented by the number of grid between 1 and 12 spaces (It's like bootstrap grid)
  widgetDimensions = {
    minWidth: 4,
    minHeight: 4,
    maxWidth: 12,
    maxHeight: 6
  };

  constructor() {
    this.widgetProps = {
      className: 'layout',
      cols: { lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      rowHeight: 100,
      isDraggable: true,
      isResizable: true
    };
  }

  addWidgetItem = (widgetType) => {
    const { x, y } = this.getXYPosition();
    //console.log('AGREGANDO WIDGET', x, y);
    const newId = Utils.getNewId();
    const newWidget = new Widget(
      newId,
      x,
      y,
      this.widgetDimensions.minWidth,
      this.widgetDimensions.minHeight,
      widgetType
    );
    this.widgetLayouts.push({
      w: this.widgetDimensions.minWidth,
      h: this.widgetDimensions.minHeight,
      x,
      y: y === Infinity ? 0 : y,
      i: newId
    });
    //console.log('this.widgetLayouts', this.widgetLayouts);
    this.oldLayout.push({
      w: this.widgetDimensions.minWidth,
      h: this.widgetDimensions.minHeight,
      x,
      y,
      i: newId
    });
    this.widgetItems.push(newWidget);
  };

  setWidgetType = (i, widgetType) => {
    const widget = this.findWidgetByI(i);
    widget.widgetType = widgetType;
  }

  setWidgetGraphAxisLegend = (i, axisName, legend) => {
    const widget = this.findWidgetByI(i);
    if (widget) {
      widget.setWidgetGraphAxisLegend(widget, axisName, legend);
    }
  }

  setWidgetGraphAxisDataSource = (i, axisName, dataSource) => {
    const widget = this.findWidgetByI(i);
    if (widget) {
      widget.setWidgetGraphAxisDataSource(widget, axisName, dataSource);
    }
  }

  findWidgetByI = (i) => {
    const widget = this.widgetItems.find((w) => {
      return w.i === i;
    });
    return widget;
  }

  getXYPosition = () => {
    const widthSum = [];
    let xPos = 0;
    let yPos = Infinity;
    let yPosAux = 0;
    let itemValue = 0;
    let substractCols;
    this.layoutTaken.forEach((item) => {
      if (isNaN(widthSum[item.y])) {
        widthSum[item.y] = parseInt(item.w, 10);
      } else {
        widthSum[item.y] += parseInt(item.w, 10);
      }
    });
    widthSum.every((item, index) => {
      yPosAux = index;
      itemValue = item;
      substractCols = this.cols - item;
      return !(substractCols >= this.widgetDimensions.minWidth);
    });
    if (substractCols >= this.widgetDimensions.minWidth) {
      xPos = itemValue;
      yPos = yPosAux;
    } else {
      xPos = 0;
      yPos = Infinity;
    }
    return {
      x: xPos,
      y: yPos
    };
  };

  getWidgetCount = () => {
    return this.widgetItems.length;
  };

  breakpointChange = (breakpoint, cols) => {
    this.breakPoint = breakpoint;
    this.cols = cols;
  };

  layoutChange = (layout, layoutTaken = []) => {
    let layoutAux = layout;
    if (layoutAux.length === 0) {
      layoutAux = layoutTaken;
    }
    this.layout = layoutAux;

    layoutAux.forEach((lay) => {
      let indexAux;
      const widget = this.widgetItems.find((wid, idx) => {
        indexAux = idx;
        return wid.i === lay.i;
      });
      if (widget !== undefined) {
        widget.w = lay.w;
        widget.h = lay.h;
        widget.x = lay.x;
        widget.y = lay.y;
        widget.dimensions.width = lay.w;
        widget.dimensions.height = lay.h;
        widget.position.x = layoutTaken[indexAux].x;
        widget.position.y = layoutTaken[indexAux].y;
        // widget.position.x = layoutTaken[index].x;
        // widget.position.y = layoutTaken[index].y;
      }
    });
  };

  setOldLayouts = (layout) => {
    this.oldLayouts[this.breakPoint] = layout;
  }

  removeWidgetItem = (widgetItemId) => {
    const items = this.widgetItems.filter((item) => {
      return item.i !== widgetItemId;
    });
    this.widgetItems = items;
    const oldItems = this.oldLayout.filter((item) => {
      return item.i !== widgetItemId;
    });
    this.oldLayout = oldItems;
    const widgetLayouts = this.widgetLayouts.filter((item) => {
      return item.i !== widgetItemId;
    });
    this.widgetLayouts = widgetLayouts;
  };

  setWidgetsForRendering = (widgetList) => {
    if (widgetList.length > 0) {
      const widgets = widgetList.map((item) => {
        const newWidget = new Widget(
          Utils.getNewId(),
          item.layout.position.x,
          item.layout.position.y,
          item.layout.dimensions.width,
          item.layout.dimensions.height,
          item.widgetType,
          item.graph
        );
        newWidget.widgetTitle = item.title;
        newWidget.queryId = item.queryId;
        newWidget.queryParameters = item.queryParameters;

        this.oldLayout.push({
          w: item.layout.dimensions.width,
          h: item.layout.dimensions.height,
          x: item.layout.position.x,
          y: item.layout.position.y,
          i: Utils.getNewId()
        });

        this.widgetTitles.push(item.title);

        return newWidget;
      });
      //console.log('WIDGETS', widgets);
      this.widgetItems = widgets;
    }
  }
}

export default WidgetContainerStore;
