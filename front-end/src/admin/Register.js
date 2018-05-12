import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { API_ROOT } from '../util/api-config.js';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

axios.defaults.withCredentials = true;

class Register extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            passwordConf:'',
            requiredEmail: false,
            requiredPassword: false,
            requiredPasswordConf: false
        }
    }

    handleClick(event){
        if (this.validateEmail() || this.validatePassword() || this.validatePasswordConf()) {
            return;
        }

        var payload={
            "email":this.state.email,
            "password":this.state.password,
            "passwordConf":this.state.passwordConf
        }
        axios.post(API_ROOT+'/login', payload)
            .then((response) => {
                console.log(response);
                if(response.data.isValid){
                    this.props.history.push('/events');
                } else{
                    alert(response.data.error);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    validateEmail() {
        let isValid = this.state.email === "";
        this.setState({requiredEmail: isValid});
        return isValid;
    }

    validatePassword() {
        let isValid = this.state.password === "";
        this.setState({requiredPassword: isValid});
        return isValid;
    }

    validatePasswordConf() {
        let isValid = this.state.passwordConf === "";
        this.setState({requiredPasswordConf: isValid});
        return isValid;
    }

    render() {
        const{requiredEmail, requiredPassword, requiredPasswordConf} = this.state;
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Register"
                            showMenuIconButton={false}
                        />
                        <TextField
                            hintText="Enter your Email"
                            type="email"
                            floatingLabelText="Email"
                            errorText={
                                requiredEmail ? "This field is required" : ""
                            }
                            onChange = {(event,newValue) => {
                                this.setState({email:newValue}, this.validateEmail);
                            }}
                        />
                        <br/>
                        <TextField
                            type = "password"
                            hintText="Enter your Password"
                            floatingLabelText="Password"
                            errorText={
                                requiredPassword ? "This field is required" : ""
                            }
                            onChange = {(event,newValue) => {
                                this.setState({password:newValue}, this.validatePassword);
                            }}
                        />
                        <br/>
                        <TextField
                            type = "password"
                            hintText="Repeat your Password"
                            floatingLabelText="Repeat Password"
                            errorText={
                                requiredPasswordConf ? "This field is required" : ""
                            }
                            onChange = {(event,newValue) => {
                                this.setState({passwordConf:newValue}, this.validatePasswordConf);
                            }}
                        />
                        <br/>
                        <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
};
export default withRouter(Register);