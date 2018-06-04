export const text = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'left' });
};
export const number = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'right' });
};

export const numberWithTwoDecimals = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'right' });
};

export const percentage = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'right' });
};

export const date = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'center' });
};

export const time = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'center' });
};

export const dateTime = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'center' });
};

export const currency = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'right' });
};

export const currencyWithTwoDecimals = (columnStyle) => {
  Object.assign(columnStyle, { textAlign: 'right' });
};
