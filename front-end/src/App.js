import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import LoginScreen from './admin/LoginScreen';

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
                {this.state.loginPage}
                {this.state.eventsScreen}
            </div>
        );
    }
}

export default App;