import React, { Component } from 'react';
import moment from 'moment';
import areIntlLocalesSupported from 'intl-locales-supported';
import IntlPolyfill from 'intl';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TextField from 'material-ui/TextField';
//import FontIcon from 'material-ui/FontIcon';
import ActionToday from 'material-ui/svg-icons/action/date-range';
//import RaisedButton from 'material-ui/RaisedButton';
import Settings from '../../settings';

const style = {
  component: {
    display: 'flex',
    flexDirection: 'row',
    //alignItems: 'center'
  },
};

class DateInput extends Component {
  constructor(props) {
    super(props);
    if (areIntlLocalesSupported(['es'])) {
      this.DateTimeFormat = global.Intl.DateTimeFormat;
    } else {
      this.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
    const parsed = new moment(props.value, Settings.supportedDateFormats);
    const toDated = parsed.toDate();
    const now = new Date();
    console.log(now);
    this.state = {
      dialogDate: parsed.isValid() ? toDated : undefined,
      dateTextFieldValue: props.value ? toDated.toDateString() : '',
      dateTextError: undefined
    };
  }

  /*textFieldBlur = (event) => {
    const parsed = new moment(event.target.value, Settings.supportedDateFormats, true);
    if (parsed.isValid()) {
      const date = this.state.dialogDate ? this.state.dialogDate : new Date();
      date.setTime(parsed.toDate().getTime());
      this.setState({ dateTextFieldValue: parsed.format('DD/MM/YYYY'), dialogDate: date, dateTextError: undefined });
    } else {
      this.setState({ dateTextError: ' ' });
    }
  }
  textFieldChange = (event) => {
    console.log(Settings.supportedDateFormats);
    const parsed = new moment(event.target.value, Settings.supportedDateFormats, true);
    if (event.target.value.length >= 8 && parsed.isValid()) {
      const date = this.state.dialogDate ? this.state.dialogDate : new Date();
      date.setTime(parsed.utc().toDate().getTime());
      this.setState({ dateTextFieldValue: parsed.format('DD/MM/YYYY'), dialogDate: date, dateTextError: undefined });
    } else {
      this.setState({ dateTextFieldValue: event.target.value, dateTextError: ' ' });
    }
  }*/

  showCalendar = () => {
    this.refs.dialogWindow.show();
  }
  handleChange = (date) => {
    let parsed;
    //const momentEs = moment().locale('es');
    if (date instanceof Date && !isNaN(date.valueOf())) {
      parsed = new moment(date.toISOString().split('T')[0], Settings.supportedDateFormats, 'es', true);
    } else {
      parsed = new moment(date, Settings.supportedDateFormat, 'es', true);
    }
    if (parsed.isValid()) {
      const selectedDate = this.state.dialogDate ? this.state.dialogDate : new Date();
      selectedDate.setTime(parsed.toDate().getTime());
      this.props.handleChange(selectedDate.toISOString().split('T')[0]);
      this.setState({ dateTextFieldValue: parsed.format(Settings.supportedDateFormat), dialogDate: selectedDate, dateTextError: undefined });
    } else {
      this.setState({ dateTextFieldValue: event.target.value, dateTextError: ' ' });
    }
  }

  render() {
    return (
      <div style={style.component}>
        <div>
          <div style={{ width: '100%' }}>
            <TextField
              onBlur={(event) => { this.handleChange(event.target.value); }}
              onChange={(event) => { this.handleChange(event.target.value); }}
              hintText={this.props.hintText}
              floatingLabelText={this.props.floatingLabelText !== null ? this.props.floatingLabelText : this.props.name}
              floatingLabelFixed
              fullWidth={!!(this.props.fullWidth === undefined || this.props.fullWidth)}
              value={this.state.dateTextFieldValue}
              errorText={this.state.dateTextError}
              hintStyle={this.props.hintStyle}
              inputStyle={this.props.inputStyle !== null ? this.props.inputStyle : {}}
              floatingLabelFocusStyle={this.props.floatingLabelFocusStyle != null ? this.props.floatingLabelFocusStyle : {}}
              floatingLabelStyle={this.props.floatingLabelStyle != null ? this.props.floatingLabelStyle : {}}
              underlineStyle={this.props.underlineStyle !== null ? this.props.underlineStyle : {}}
              underlineFocusStyle={this.props.underlineFocusStyle}

            />
          </div>
          <div style={{ zIndex: '100' }}>
            <DatePickerDialog
              ref="dialogWindow"
              container={'inline'}
              autoOk
              DateTimeFormat={this.DateTimeFormat}
              onAccept={this.handleChange}
              initialDate={this.state.dialogDate}
              locale="es"
              value={this.state.dialogDate ? this.state.dialogDate : this.props.value}
              firstDayOfWeek={1}
              cancelLabel="Cancelar"
              containerStyle={{ color: 'blue' }}
            />
          </div>
        </div>
        <div
          style={{ paddingTop: '30px' }}
        >
          <ActionToday
            style={{ color: '#A0A7B9', backgroundColor: '#fff', cursor: 'pointer', padding: '3px', borderRadius: '5px' }}
            onTouchTap={this.showCalendar}
          />
        </div>
      </div >
    );
  }
}

export default DateInput;
