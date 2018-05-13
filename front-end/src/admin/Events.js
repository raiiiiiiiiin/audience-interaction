import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import axios from "axios/index";
import {API_ROOT} from "../util/api-config";
import Moment from 'moment';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from "react-router";
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

axios.defaults.withCredentials = true;

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            defaultValue: PropTypes.number.isRequired
        };

        state = {
            events: [],
            openAddEvent: false,
            name: '',
            requiredName: false,
            code: '',
            requiredCode: false,
            startPeriod: '',
            requiredStartPeriod: false,
            endPeriod: '',
            requiredEndPeriod: false
        };

        validateStartPeriod() {
            let isValid = this.state.startPeriod === "";
            this.setState({requiredStartPeriod: isValid});
            return isValid;
        }

        validateEndPeriod() {
            let isValid = this.state.endPeriod === "";
            this.setState({requiredEndPeriod: isValid});
            return isValid;
        }

        validateName() {
            let isValid = this.state.name === "";
            this.setState({requiredName: isValid});
            return isValid;
        }

        validateCode = () => {
            let isValid = this.state.code === "";
            this.setState({requiredCode: isValid});
            return isValid;
        }

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
            axios.post(API_ROOT+'/get-events')
                .then((response) => {
                    this.setState({
                        events: response.data
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.props.history.push('/admin');
                });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
        };

        logout = () => {
            axios.post(API_ROOT+'/logout')
                .then((response) => {
                    this.props.history.push('/admin');
                })
                .catch(function (error) {
                    console.log(error);
                });
        };


        handleOpenDialog = () => {
            this.setState({openAddEvent: true});
        };

        handleCloseDialog = () => {
            this.setState({openAddEvent: false});
        };

        addEvent = () => {
            if (this.validateCode() || this.validateName()
            || this.validateStartPeriod() || this.validateEndPeriod()) {
                return;
            }


            var payload={
                "startPeriod":this.state.startPeriod,
                "endPeriod":this.state.endPeriod,
                "code":this.state.code,
                "name":this.state.name
            }
            axios.post(API_ROOT+'/create-event', payload)
                .then((response) => {
                    if(!response.data.errmsg){
                        window.location.reload()
                    } else{
                        alert("Error adding event");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        handleChangeStartPeriod = (event, date) => {
            this.setState({startPeriod: date.toISOString()}, this.validateStartPeriod);
        };

        handleChangeEndPeriod = (event, date) => {
            this.setState({endPeriod: date.toISOString()}, this.validateEndPeriod);
        };

        render() {
            const dialogActions = [
                <FlatButton
                    label="Ok"
                    primary={true}
                    onClick={this.addEvent}
                />,
                <FlatButton
                    label="Cancel"
                    primary={false}
                    onClick={this.handleCloseDialog}
                />,
            ];
            const{requiredName, requiredCode,requiredStartPeriod,requiredEndPeriod} = this.state;

            Moment.locale('en');
            return (
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Events"
                            iconElementLeft={<IconButton onClick={() => this.handleOpenDialog()}><AddIcon /></IconButton>}
                            iconElementRight={<FlatButton label="Log out" onClick={()=> this.logout()}/>}
                        />
                        <ComposedComponent
                            value={this.state.selectedIndex}
                            onChange={this.handleRequestChange}
                        >

                            {
                                this.state && this.state.events.length > 0 ? this.state.events.map((event, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            value={event.urlId}
                                            primaryText={
                                                <p>
                                                    Name: {event.name}
                                                    <br/>
                                                    Code: {event.code}
                                                </p>
                                            }
                                            secondaryText={
                                                <p>
                                                    Start: {Moment(event.startPeriod).format("LLLL")}
                                                    <br />
                                                    End: {Moment(event.endPeriod).format("LLLL")}
                                                </p>
                                            }
                                            secondaryTextLines={2}
                                            onClick={()=>{this.props.history.push({
                                                pathname:'/event',
                                                state: {urlId: event.urlId}
                                            })}}
                                        />)
                                })
                                    :
                                    <div><p>There are no current events. You can add an event by using the '+' button on the upper left corner.</p></div>
                            }
                        </ComposedComponent>
                        <Dialog
                            title="Add Event"
                            actions={dialogActions}
                            modal={false}
                            open={this.state.openAddEvent}
                            onRequestClose={this.handleCloseDialog}
                            autoScrollBodyContent={true}
                        >
                            <TextField
                                hintText="Event code"
                                floatingLabelText="Code"
                                errorText={
                                    requiredCode ? "This field is required" : ""
                                }
                                onChange = {(event,newValue) => {
                                    if ((/^^[a-zA-Z0-9]*$/.test(newValue))) {
                                        this.setState({code:newValue}, this.validateCode);
                                    } else{
                                        return false;
                                    }
                                }}
                                value={this.state.code}
                            />
                            <br/>
                            <TextField
                                hintText="Event name"
                                floatingLabelText="Name"
                                errorText={
                                    requiredName ? "This field is required" : ""
                                }
                                onChange = {(event,newValue) => {
                                    this.setState({name:newValue}, this.validateName);
                                }}
                            />
                            <br/>
                            <DatePicker
                                maxDate={new Date(this.state.endPeriod)}
                                onChange={this.handleChangeStartPeriod}
                                autoOk={true}
                                floatingLabelText="Start Period"
                                errorText={
                                    requiredStartPeriod ? "This field is required" : ""
                                }
                            />
                            <br/>
                            <DatePicker
                                minDate={new Date(this.state.startPeriod)}
                                onChange={this.handleChangeEndPeriod}
                                autoOk={true}
                                floatingLabelText="End Period"
                                errorText={
                                    requiredEndPeriod ? "This field is required" : ""
                                }
                            />
                        </Dialog>
                    </div>
                </MuiThemeProvider>
            );
        }
    };
}

SelectableList = withRouter(wrapState(SelectableList));

const Events = () => (
            <SelectableList defaultValue={3}/>

);

export default Events;