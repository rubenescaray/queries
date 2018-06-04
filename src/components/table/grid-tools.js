import React from 'react';
import { runOperation, aggregationOperation, operationDescriptor } from './data-aggregations';
import * as formatting from '../formatting/formatter';

export const footer = (field, data) => {
  let footerData;
  if (data && data.length && data.length > 0) {
    footerData = data.map((row) => { return row[field]; });
  }
  return footerData;
};

export const getColumnRenders = (groupByAggregations, footerAggregations, data, fieldName, fieldType) => {
  let Cell;
  let Footer;
  let aggregate;
  let Aggregated;
  let PivotValue;
  let renders = {};
  let columnAggregation;
  let footerAggregation;
  if ((groupByAggregations && groupByAggregations !== null && groupByAggregations.length > 0) || (footerAggregations && footerAggregations !== null && footerAggregations.length > 0)) {
    columnAggregation = groupByAggregations.find((aggregation) => {
      return aggregation.field === fieldName;
    });
    footerAggregation = footerAggregations.find((aggregation) => {
      return aggregation.field === fieldName;
    });
  }
  if (footerAggregation && footerAggregation.operator) {
    Footer = () => {
      const footerData = footer(footerAggregation.field, data);
      const operationResult = runOperation(footerAggregation.operator, footerData);
      let footerDescription = operationDescriptor[footerAggregation.operator];
      footerDescription += ': ';
      const render = (operationResult) ? (<div><span><strong>{footerDescription/*`${operationDescriptor[footerAggregation.operator]}: `*/}</strong>{formatting[fieldType](operationResult)}</span></div>) : null;
      return render;
    };
  }
  if (columnAggregation && columnAggregation.operator) {
    aggregate = (vals, rows) => {
      const isPivot = rows.every((row) => {
        return row._groupedByPivot;
      });
      let operation;
      if (isPivot && columnAggregation.operator === 'setSize') {
        operation = aggregationOperation('sum');
      } else {
        operation = aggregationOperation(columnAggregation.operator);
      }
      return operation(vals);
    };
    Aggregated = (row) => {
      if (row.row[columnAggregation.field]) {
        return (<span>{formatting[fieldType](row.row[columnAggregation.field])}</span>);
      }
    };
    Cell = (row) => {
      return (<span>{formatting[fieldType](row.value)}</span>);
    };

  } else {
    Cell = (row) => {
      const cellRender = formatting[fieldType](row.original ? row.original[fieldName] : null);
      return (<div><span>{cellRender}</span></div>);
    };
    Aggregated = () => {
      return (<span>{''}</span>);
    };
    PivotValue = (row) => {
      return (<span>{row.value}</span>);
    };
  }
  renders = Object.assign({}, { Footer, Cell, aggregate, Aggregated, PivotValue });
  return renders;
};

export const getFormatRender = (type, field) => {
  let render;
  switch (type) {
  case 'date':
    render = (row) => {
      const date = new Date(row[field]);
      return (<div><span>{date.toLocaleDateString()}</span></div>);
    };
    break;
  case 'number':
    render = (row) => {
      return (<div><span>{new Intl.NumberFormat().format(row[field])}</span></div>);
    };
    break;
  case 'currency':
    render = (row) => {
      return (<div><span>{`'$ '${new Intl.NumberFormat().format(row[field])}`}</span></div>);
    };
    break;
  default:
    render = (row) => {
      return (<div><span>{row[field]}</span></div>);
    };
  }
  return render;
};
