import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { TextField, RaisedButton } from 'material-ui';
import styled from 'styled-components';
import { Row, Column } from '../../components/layout/gridSystem';
import LoginStore from './stores/LoginStore';
//import { authService } from '../../services/Services';
import * as ValidationEngine from '../../components/validation/validationEngine';
import ValidationStore from '../../components/validation/validationStore';
import Utils from '../../utils';
import PicLogoColor from '../../images/pic_logocolor.png';

const Wrapper = styled.div`
  // Small devices (phones, 320 to 768... less than 768px)
  @media (min-width: 320px) {
    width: 90%;
    margin-top: 15%;
    padding: 30px 20px 25px 20px;
    margin-left: -45%;
  }

  // Medium devices (tablets, 768 to 1024... less than 1024px)
  @media only screen
    and (min-width: 768px) {
      width: 70%;
      margin-top: 20%;
      padding: 25px 20px;
      margin-left: -35%;
  }

  // Large devices (laptos, desktops, more than 1024px)
  @media (min-width: 1024px) {
    width: 30%;
    margin-top: 15%;
    padding: 25px 20px;
    margin-left: -15%;
  }
`;

const styles = {
  wrapper: {
    position: 'absolute',
    left: '50%',
    minHeight: '300px',
    textAlign: 'center',
    opacity: '0.9',
    display: 'block',
    backgroundColor: '#FFF',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  signin: {
    fontSize: '20px'
  },
  textField: {
    fontSize: '18px'
  },
  buttonsContainer: {
    marginTop: '40px'
  },
  linkContainer: {
    marginTop: '30px'
  },
  link: {
    color: '#4171DE',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
};

@inject('snackBarStore')
@inject('authService')
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    this.loginStore = new LoginStore(this.props.authService, this.props.snackbarStore);
    this.validationStore = new ValidationStore();
    this.fieldsValidationProps = {
      usernameValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldUsername',
        customErrorText: ''
      },
      passwordValidationProps: {
        required: true,
        parentId: undefined,
        fieldId: Utils.getNewId(),
        name: 'fldPassword',
        customErrorText: ''
      }
    };

    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.usernameValidationProps);
    ValidationEngine.buildRules(this.validationStore, this.fieldsValidationProps.passwordValidationProps);
  }

  handleNameChange = (props, e) => {
    this.loginStore.username = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handlePasswordChange = (props, e) => {
    this.loginStore.password = e.target.value;
    ValidationEngine.validateRules(this.validationStore, e.target.value, props.parentId, props.fieldId, props.name);
  }

  handleLogin = () => {
    this.loginStore.login(this.loginStore.username, this.loginStore.password).then((result) => {
      if (result === true) {
        this.props.router.push('/sources/index');
      }
    })
    .catch((error) => {
      this.props.snackBarStore.setMessage(error);
    });
  }

  render() {
    return (
      <Wrapper style={styles.wrapper}>
        <div>
          <img src={PicLogoColor} alt="" />
          <div>
            <span style={styles.signin}>Iniciar Sesión</span>
          </div>
        </div>
        <div>
          <div>
            <TextField
              style={styles.textField}
              fullWidth
              floatingLabelFixed
              errorText={this.fieldsValidationProps.usernameValidationProps.customErrorText}
              floatingLabelText="Usuario"
              value={this.loginStore.username}
              onChange={(e) => { this.handleNameChange(this.fieldsValidationProps.usernameValidationProps, e); }}
              onBlur={(e) => { this.handleNameChange(this.fieldsValidationProps.usernameValidationProps, e); }}
            />
          </div>
          <div>
            <TextField
              style={styles.textField}
              fullWidth
              floatingLabelFixed
              errorText={this.fieldsValidationProps.passwordValidationProps.customErrorText}
              floatingLabelText="Contraseña"
              type="password"
              value={this.loginStore.password}
              onChange={(e) => { this.handlePasswordChange(this.fieldsValidationProps.passwordValidationProps, e); }}
              onBlur={(e) => { this.handlePasswordChange(this.fieldsValidationProps.passwordValidationProps, e); }}
            />
          </div>
          <div style={styles.linkContainer}>
            <a style={styles.link}><span>¿Olvidó su Contraseña?</span></a>
          </div>
          {this.loginStore.error &&
          <Row>
            <Column>
              <p>{this.loginStore.error}</p>
            </Column>
          </Row>
          }
          <div style={styles.buttonsContainer}>
            <Row>
              <Column>
                <RaisedButton
                  label="CANCELAR"
                  onClick={() => { this.handleLogin(); }}
                  secondary
                  fullWidth
                />
              </Column>
              <Column>
                <RaisedButton
                  label="ACEPTAR"
                  onClick={() => { this.handleLogin(); }}
                  primary
                  type="submit"
                  fullWidth
                />
              </Column>
            </Row>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default Login;
