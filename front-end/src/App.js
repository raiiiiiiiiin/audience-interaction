import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import LoginScreen from './admin/LoginScreen';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./audience/Home";
import Events from "./admin/Events";

injectTapEventPlugin();
class App extends Component {
    constructor(props){
        super(props);
        this.state={
            loginPage:[],
            eventsScreen:[]
        }
    }
    componentWillMount(){
        var loginPage =[];
        loginPage.push(<LoginScreen key={0} parentContext={this}/>);
        this.setState({
            loginPage:loginPage
        })
    }
    render() {
        return (
            <div className="App">
                <Router >
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/admin" component={LoginScreen} />
                        <Route path="/events" component={Events} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;