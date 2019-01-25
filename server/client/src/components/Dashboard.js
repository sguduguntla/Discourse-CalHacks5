import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import CourseCard from './CourseCard';

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <div className="container-fluid" style={{marginTop: "5vh"}}>
                    <h2>Courses</h2>
                    <div className="row">
                        {this.props.courses.myCourses.map(course => {
                            return (<CourseCard key={course._id} course={course} user={this.props.auth.user}/>);
                        })}
                    </div>
                </div>           
        );
    }
}

const mapStateToProps = ({courses, auth}) => {
    return { courses, auth }
};

export default connect(mapStateToProps, actions)(Dashboard);