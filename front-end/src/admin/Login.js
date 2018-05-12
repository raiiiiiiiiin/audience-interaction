import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Events from './Events';
import { API_ROOT } from '../util/api-config.js';
import axios from 'axios';

class Login extends Component {

    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            requiredEmail: false,
            requiredPassword: false
        }
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

    handleClick(event){
        if (this.validateEmail() || this.validatePassword()) {
            return;
        }

        var self = this;
        var payload={
            "logEmail":this.state.email,
            "logPassword":this.state.password
        }
        axios.post(API_ROOT+'/login', payload)
            .then(function (response) {
                if(response.data.isValid){
                    console.log("Login successful");
                    var eventsScreen=[];
                    eventsScreen.push(<Events key={0} appContext={self.props.appContext}/>)
                    self.props.appContext.setState({loginPage:[],eventsScreen:eventsScreen})
                }
                else{
                    alert(response.data.error);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const{requiredEmail, requiredPassword} = this.state;
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Login"
                        />
                        <TextField
                            hintText="Enter your email"
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
                            type="password"
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

export default Login;