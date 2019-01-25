import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';
import Dashboard from './Dashboard';
import CourseView from './CourseView'; 
import Header from './Header';
import MyProfile from './MyProfile';
import Profile from './Profile';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: "0"
        }
    }

    componentDidMount() {
        this.props.fetchCurrentUser();
    }
    
    render() {
        return (
               <div>
                <BrowserRouter>
                    <div>
                        <div style={{ width: this.state.width }} id="mySidenav" className="sidenav">
                            <a href="javascript:void(0)" className="closebtn" onClick={e => this.setState({width: "0"})}>&times;</a>
                            <a href="#">ABOUT</a>
                            <a href="#">SERVICES</a>
                            <a href="#">CLIENTS</a>
                            <a href="#">CONTACT</a>
                        </div>
                        <div id="main" style={{ marginLeft: this.state.width }}>
                            <Header toggler={window.location.pathname != "/" ? <span style={{fontSize: "30px", cursor: "pointer", marginRight: "20px" }} onClick={e => this.state.width == "250px" ? this.setState({width: "0"}) : this.setState({width: "250px"})}>&#9776;</span> : ""} />
                            <div>
                                <Route exact path="/" component={Landing} />
                                <Route exact path="/dashboard" component={Dashboard} />
                                <Route exact path="/courses/:id" component={CourseView} />
                                <Route exact path="/profile" component={MyProfile} />
                                <Route exact path="/users/:id" component={Profile} />
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
};

const mapStateToProps = ({ auth }) => {
    return { auth };
}

export default connect(mapStateToProps, actions)(App);