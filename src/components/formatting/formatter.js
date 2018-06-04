const numberFormatter = new Intl.NumberFormat(navigator.languages ? navigator.languages[0] : navigator.language);
const numberWithDecimalsFormatter = new Intl.NumberFormat(navigator.languages ? navigator.languages[0] : navigator.language, { minimumFractionDigits: 2 });
const percentageFormatter = new Intl.NumberFormat(navigator.languages ? navigator.languages[0] : navigator.language, { style: 'percent' });

export const text = (string) => {
  return string;
};
export const number = (numberString) => {
  if (numberString) {
    return numberFormatter.format(numberString);
  }
  return null;
};

export const numberWithTwoDecimals = (numberString) => {
  if (numberString) {
    return numberWithDecimalsFormatter.format(numberString);
  }
  return null;
};

export const percentage = (percentageString) => {
  if (percentageString) {
    return percentageFormatter.format(percentageString);
  }
  return null;
};

export const date = (dateString) => {
  if (dateString) {
    const dateVar = new Date(dateString);
    const formattedDate = dateVar.toLocaleDateString(navigator.languages ? navigator.languages[0] : navigator.language);
    return formattedDate;
  }
  return null;
};

export const time = (timeString) => {
  if (timeString) {
    const timeVar = new Date(timeString);
    const formattedDate = timeVar.toLocaleTimeString(navigator.languages ? navigator.languages[0] : navigator.language);
    return formattedDate;
  }
  return null;
};

export const dateTime = (dateTimeString) => {
  if (dateTimeString) {
    const dateTimeVar = new Date(dateTimeString);
    const formattedDateTime = `${dateTimeVar.toLocaleDateString(navigator.languages ? navigator.languages[0] : navigator.language)} ${dateTimeVar.toLocaleTimeString(navigator.languages ? navigator.languages[0] : navigator.language)}`;
    return formattedDateTime;
  }
  return null;
};

export const currency = (currencyString) => {
  if (currencyString) {
    return `$ ${numberFormatter.format(currencyString)}`;
  }
  return null;
};

export const currencyWithTwoDecimals = (currencyString) => {
  if (currencyString) {
    return `$ ${numberWithDecimalsFormatter.format(currencyString)}`;
  }
  return null;
};
