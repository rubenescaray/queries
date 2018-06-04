import * as FieldTypesColumnStyles from '../formatting/columnStyles';
import * as AggregationRenders from './grid-tools';

export const defineColumns = (fields, data, groupBy, groupByAggregations, summary, allowExpandPivot = true) => {
  return fields.map((s) => {
    const column = {
      Header: s.label && s.label !== '' ? s.label : s.name,
      accessor: s.name,
      minWidth: 150,
      maxWidth: undefined,
      style: {}
    };
    FieldTypesColumnStyles[s.type || 'text'](column.style);
    if (!allowExpandPivot) {
      column.Expander = () => { return null; };
      column.expander = false;
    }
    const renders = AggregationRenders.getColumnRenders(groupByAggregations, summary, data, s.name, s.type);
    if (renders) {
      Object.assign(column, renders);
    }
    return column;
  });
};

export default defineColumns;
