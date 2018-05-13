import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { API_ROOT } from '../util/api-config.js';
import axios from 'axios';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';
import Like from 'material-ui/svg-icons/action/thumb-up';
import Unlike from 'material-ui/svg-icons/action/thumb-down';
import Badge from 'material-ui/Badge';
import SortIcon from 'material-ui/svg-icons/content/sort';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

axios.defaults.withCredentials = true;

class Event extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);

        this.state={
            question:'',
            name:'',
            event: {},
            sessionId:'',
            sortType: ['Likes', 'Created time'],
            selectedSort: 'Likes'
        }
    }

    componentWillMount() {
        this.getEvent();
    };

    getEvent= () => {
        axios.post(API_ROOT+'/event')
            .then((response) => {
                this.setState({event: response.data.event, sessionId: response.data.sessionId}, this.sort);
            })
            .catch((error) => {
                console.log(error);
                //this.props.history.push('/');
            });
    };

    handleClick = () =>{
        var payload={
            "question":{
                "description":this.state.question,
                "name":this.state.name
            }
        };
        axios.post(API_ROOT+'/add-question', payload)
            .then( (response) => {
                this.setState({question:'',name:''});
                console.log(response.data);
            })
            .catch( (error) => {
                console.log(error);
            });
    };

    like = (question) => {
        var payload={
            "_id":question._id,
            "description":question.description,
            "createdDate":question.createdDate
        };
        axios.put(API_ROOT+'/like', payload)
            .then( (response) => {
                this.getEvent();
            })
            .catch( (error) => {
                console.log(error);
            });
    };

    unlike = (question) => {;
        axios.delete(API_ROOT+'/like', {data:{
                "_id":question._id,
                "description":question.description,
                "createdDate":question.createdDate
            }})
            .then( (response) => {
                console.log(response);
                this.getEvent();
            })
            .catch( (error) => {
                console.log(error);
            });
    };

    questionLiked = (data) => {
        var i = data.length;
        while (i--) {
            if (data[i] === this.state.sessionId) {
                return true;
            }
        }
        return false;
    };

    render() {
        Moment.locale('en');
        const questionPrimaryText = (question) => (
            <div>
                {question.name}
                <br/>
                <div style={{fontSize: '12px',
                    color: 'rgba(0,0,0,.4)'}}>{Moment(question.createdDate).format("LLLL")}
                </div>
            </div>
        );

        const questionAvatar = (question) => (
            <Avatar>{
                question.name.length > 0 ?
                    question.name[0] : 'A'
            }</Avatar>
        );

        const questionText = (question) => (
            <p>
                {question.description}
            </p>
        );

        const questionLike = (question) => (
                <div>
                    <Badge
                        badgeContent={question.unlikes.length}
                        primary={true}
                    >
                        <Unlike
                            onClick={() => this.unlike(question)}
                            style={{opacity: this.questionLiked(question.unlikes) ? 1 : .5, cursor: 'pointer'}}
                        />
                    </Badge>
                    <Badge
                        badgeContent={question.likes.length}
                        secondary={true}
                    >
                        <Like
                            onClick={() => this.like(question)}
                            style={{opacity: this.questionLiked(question.likes) ? 1 : .5, cursor: 'pointer'}}
                        />
                    </Badge>
                </div>
        )
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title={"Event: " + this.state.event.name}
                            showMenuIconButton={false}
                        />

                        <Paper style={styleLabel} zDepth={0} >
                            <p>Ask anything</p>
                        </Paper>
                        <Paper style={style} zDepth={2} >
                            <TextField
                                hintText="Type your question"
                                onChange = {(event,newValue) => {
                                    this.setState({question:newValue});
                                }}
                                multiLine={true}
                                style={{paddingRight: 100, width:'80%'}}
                                value={this.state.question}
                                underlineShow={false}
                            />
                            <br/>
                            {
                                this.state.question!=="" ?
                                    <div>
                                        <Divider/>
                                        <TextField
                                            hintText="Your name (optional)"
                                            onChange = {(event,newValue) => {
                                                this.setState({name:newValue});
                                            }}
                                            value={this.state.name}
                                            underlineShow={false}
                                            style={{width:'80%'}}

                                        />
                                        <RaisedButton label="Send" primary={true} onClick={() => this.handleClick()}/>
                                    </div>
                                : <br/>
                            }
                        </Paper>
                        {
                            this.state.event && this.state.event.questions ?
                                <div>
                                    <Paper style={styleLabel} zDepth={0} >
                                        <div style={{display: 'flex'}}>
                                            <p style={{flex: 1}}>
                                                {this.state.event.questions.length} questions
                                            </p>
                                            <div style={{display: 'flex',flex: .1}}>
                                                <p style={{fontSize:10}}>{this.state.selectedSort}</p>
                                                <IconMenu
                                                    iconButtonElement={<IconButton><SortIcon /></IconButton>}
                                                    multiple={false}
                                                    onItemClick={(event, value)=>this.setState({selectedSort: value.key},console.log(value))}
                                                >
                                                    <MenuItem primaryText="Sort questions by" disabled={true}/>
                                                    {
                                                        this.state.sortType && this.state.sortType.map((sort, index) => {
                                                            return (
                                                                <MenuItem key={sort} value={sort} primaryText={sort}/>
                                                            )
                                                        })
                                                    }
                                                </IconMenu>

                                            </div>
                                        </div>
                                    </Paper>
                                <Paper style={style} zDepth={2} >
                                <List style={{textAlign:'left'}}>
                                    {
                                        this.state.event.questions.sort((a,b) => {
                                            if (this.state.selectedSort === 'Likes') {
                                                return a.likes.length<b.likes.length;
                                            } else if (this.state.selectedSort === 'Created time') {
                                                return a.createdDate<b.createdDate;
                                            }
                                        }).map((question, index) => {return(
                                            <div key={index}>
                                            <ListItem
                                                leftAvatar={questionAvatar(question)}
                                                primaryText={questionPrimaryText(question)}
                                                secondaryText={questionText(question)}
                                                rightIconButton={questionLike(question)}
                                                secondaryTextLines={2}
                                                disabled={true}
                                            />
                                            <Divider inset={true} />
                                            </div>
                                        )})
                                    }
                                </List>
                                </Paper>
                                </div>
                                : null

                        }
                    </div>
                </MuiThemeProvider>{
                console.log(this.state.event.questions)}
            </div>);
    }
}

const style = {
    width: '50%',
    marginLeft:20,
    marginRight:20,
    textAlign: 'center',
    display: 'inline-block',
    marginBottom: 20
};

const styleLabel = {
    width: '50%',
    marginLeft:20,
    marginRight:20,
    textAlign: 'left',
    display: 'inline-block',
    marginTop: 20,
    color: 'rgba(0,0,0,.4)'
};


export default withRouter(Event);