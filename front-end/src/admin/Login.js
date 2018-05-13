import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { API_ROOT } from '../util/api-config.js';
import axios from 'axios';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

axios.defaults.withCredentials = true;

class Login extends Component {

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

    handleClick = (props) =>{
        if (this.validateEmail() || this.validatePassword()) {
            return;
        }

        var payload={
            "logEmail":this.state.email,
            "logPassword":this.state.password
        }
        axios.post(API_ROOT+'/login', payload)
            .then(function (response) {
                if(response.data.isValid){
                    const{history} = props;
                    console.log("Login successful");
                    history.push('/events');

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
                            iconElementLeft={<div/>}
                            iconElementRight={<FlatButton label="Join" onClick={()=> this.props.history.push('/')}/>}
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
                        <RaisedButton label="Submit" primary={true} style={style} onClick={() => this.handleClick(this.props)}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
};

export default withRouter(Login);