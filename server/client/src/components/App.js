import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
const EnrollNew = () => <h2>EnrollNew</h2>

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header />
                        <div className="container">
                            <Route exact path="/" component={Landing} />
                            <Route exact path="/dashboard" component={Dashboard} />
                            <Route path="/enroll/new" component={EnrollNew} />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
};

export default connect(null, actions)(App);