import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { API_ROOT } from '../util/api-config.js';
import Login from "./Login";


class Register extends Component {
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

        var self = this;
        var payload={
            "email":this.state.email,
            "password":this.state.password,
            "passwordConf":this.state.passwordConf
        }
        axios.post(API_ROOT+'/login', payload)
            .then(function (response) {
                console.log(response);
                if(response.data.isValid){
                    //  console.log("registration successfull");
                    var loginscreen=[];
                    loginscreen.push(<Login key={0} parentContext={this}/>);
                    var loginmessage = "Not Registered yet.Go to registration";
                    self.props.parentContext.setState({loginscreen:loginscreen,
                        loginmessage:loginmessage,
                        buttonLabel:"Register",
                        isLogin:true
                    });
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
export default Register;