import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class CourseCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { course, user } = this.props;

        return (
            <div key={ course._id } className="card" style={{width: "18rem", margin:"10px", height: "30vh"}}>
                <div className="card-header">{course.number}
                    <div className="btn-group float-right">
                        <button className="btn btn-link text-dark dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-cog"></i>
                        </button>
                        <div className="dropdown-menu">
                            <button onClick={e => this.props.unenrollFromCourse(user._id, course._id)} className="dropdown-item" type="button">Leave Class</button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{course.name || "Course Title" }</h5>
                    <p className="card-text">{course.description || "This is the course description" }.</p>
                    <a href={`/courses/${course._id}`} className="btn btn-primary">Open</a>
                </div>
                <p className="card-text text-right m-3"><i className="fas fa-user-alt fa-sm"></i> {course.numUsers}</p>

            </div>
        );
    }
    
};

export default connect(null, actions)(CourseCard);