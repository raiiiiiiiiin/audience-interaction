import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { API_ROOT } from '../util/api-config.js';
import axios from 'axios';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

axios.defaults.withCredentials = true;

class Home extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);

        this.state={
            code:'',
            codeError:''
        }
    }

    handleClick = () =>{
        this.setState({codeError: ''});
        var payload={
            "code":this.state.code
        }
        axios.post(API_ROOT+'/join', payload)
            .then( (response) => {
                if(response.data.isValid){
                    this.props.history.push('/event');
                }
                else{
                    this.setState({codeError: 'Sorry, there is no such event active right now.'});
                }
            })
            .catch( (error) => {
                console.log(error);
            });
    };

    render() {
        return (

        <div>
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Join Event"
                        showMenuIconButton={false}
                    />
                    <TextField
                        hintText="Enter code here"
                        errorText={
                            this.state.codeError
                        }
                        onChange = {(event,newValue) => {
                            this.setState({code:newValue});
                        }}
                    />
                    <br/>
                    <RaisedButton label="Submit" primary={true} onClick={() => this.handleClick()}
                                  disabled={this.state.code===""}/>
                </div>
            </MuiThemeProvider>
        </div>);
    }
}

export default withRouter(Home);