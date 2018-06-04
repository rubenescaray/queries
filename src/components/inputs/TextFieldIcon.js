import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

const getStyles = (props) => {

  const iconStyle = {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  };

  iconStyle[(props.iconPosition === 'before' ? 'left' : 'right')] = 0;

  if (props.floatingLabelText) {
    iconStyle.top = 23;
  }

  return {
    main: {
      display: 'inline-block',
      position: 'relative',
      width: (props.fullWidth ? '100%' : '256px')
    },
    iconStyle,
    textFieldStyle: {
      textIndent: (props.iconPosition === 'before' ? 10 : 0)
    }
  };
};

export default class TextFieldIcon extends React.Component {

  constructor(props) {
    super();
    this.styles = getStyles(props);
  }

  componentWillUpdate(nextProps) {
    this.styles = getStyles(nextProps);
  }

  render() {
    const {
      icon,
      //iconPosition,
      iconProps,
      style,
      iconStyle,
      textFieldStyle,
      ...textFieldProps
    } = this.props;

    return (
      <div style={{ ...this.styles.main, ...style }}>
        <IconButton
          style={{ ...this.styles.iconStyle, ...iconStyle }}
          {...iconProps}
        >
          {icon}
        </IconButton>
        <TextField
          name="material-ui-textfield-icon"
          style={{ ...this.styles.textFieldStyle, ...textFieldStyle, paddingRight: '40px', boxSizing: 'border-box' }}
          {...textFieldProps}
          fullWidth
        />
      </div>
    );
  }
}

TextFieldIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  iconPosition: PropTypes.string,
  //iconProps: React.PropTypes.object,
  //iconStyle: React.PropTypes.object
};

TextFieldIcon.defaultProps = {
  //iconPosition: 'after'
};
