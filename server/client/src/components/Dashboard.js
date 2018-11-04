import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
    componentDidMount() {
        console.log(this.props.auth);
    }

    render() {
        return (
            <div style={{marginTop: "5vh"}} className="container">
                <h2>Courses</h2>
            </div>
        );
    }
}

const mapStateToProps = ({auth}) => {
    return { auth }
};

export default connect(mapStateToProps)(Dashboard);