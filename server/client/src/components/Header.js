import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Modal from './Modal';
import Autocomplete from 'react-autocomplete';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enroll: false,
            classKey: '',
            courseName: '',
            courseNumber: '',
            courseDescription: '',
            courseCategory: '',
            value: '',
            fetchedFriendRequests: false
        }

        this.changeEnrollState = this.changeEnrollState.bind(this);
        this.enrollSubmit = this.enrollSubmit.bind(this);
        this.createCourse = this.createCourse.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllUsers();

    }

    componentDidUpdate() {
        if (!this.props.courses) {
           this.props.fetchCourses(this.props.auth.user.myCourses);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.courses && nextProps.auth.user && nextProps.auth.user.courses.length > this.props.courses.myCourses.length) {
            this.props.fetchCourses(nextProps.auth.user.courses);
        }

        if (nextProps.auth.user && !this.state.fetchedFriendRequests) {
            this.props.fetchFriendRequests(nextProps.auth.user._id, true);
            this.setState({ fetchedFriendRequests: true })
        }

        if (nextProps.auth.message && this.props.auth.message !== nextProps.auth.message) {
            alert(nextProps.auth.message);
        }

        if (this.props.courses && this.props.courses.message !== nextProps.courses.message) {
            alert(nextProps.courses.message);
        }
    }

    renderContent() {
        switch(this.props.auth.user) {
            case null:
                return <a className="nav-link" href="/auth/google/">Login with Google</a>;
            default:
                return <a className="nav-link" href="/api/logout">Logout</a>;
        }
    }

    displayWelcome() {
        if (this.props.auth && this.props.auth.user) {
            return this.props.auth.user.name;
        }
    }

    changeEnrollState(e) {
        e.preventDefault();
        this.setState({enroll: !this.state.enroll});
    }

    enrollSubmit(e) {
        e.preventDefault();
        this.props.enrollInCourse(this.state.classKey, this.props.auth.user._id);
    }

    displayEnrollForm() {
        if (this.state.enroll) {
            return (<form onSubmit={this.enrollSubmit} className="form-inline">
                <input value={this.state.classKey} onChange={e =>  this.setState({classKey: e.target.value})} className="form-control mr-sm-2 input-sm" type="input" placeholder="Enter class key" aria-label="Search"/>
                <button className="btn btn-success btn-sm my-2 mr-sm-2 my-sm-0" type="submit">Enroll</button>
                <button onClick={this.changeEnrollState} className="btn btn-danger btn-sm my-2 my-sm-0">Hide</button>
            </form>);
        }
       
        return <a onClick={this.changeEnrollState} className="nav-link" href="#">Enroll in a class</a>;
    }

    renderSearchBox() {
        const { user, allUsers } = this.props.auth;

        if (!user || !allUsers) {
            return <div></div>;
        };

        return (<form className="form-inline my-2 my-lg-0">
                <Autocomplete
                    getItemValue={(item) => item.name}
                    items={allUsers.filter(eachUser => eachUser._id != user._id)}
                    renderItem={(item, isHighlighted) =>
                        <div key={item._id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        <a href={`/users/${item._id}`}>{item.name}</a>
                        </div>
                    }
                    value={this.state.value}
                    onChange={(e) => this.setState({value: e.target.value})}
                    onSelect={(val) => this.setState({value: val})}
                    className="form-control mr-sm-2" type="search" placeholder="Search User" aria-label="Search"
                />
                &nbsp;&nbsp;
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        );
    }

    displayNotifications() {
        const { requests } = this.props.friendRequests;
        const { user } = this.props.auth;

        if (!user || !requests || requests.length == 0) {
            return <div className="dropdown-item">None</div>;
        }

        return requests.map(request => {
            return (<div key={request._id} className="dropdown-item">Friend request from {request.sender.name}&nbsp;&nbsp; 
                <button onClick={e => this.props.acceptFriendRequest(request.sender._id, user._id)} className="btn btn-success btn-sm my-2 mr-sm-2 my-sm-0">Accept</button>
                <button onClick={e => this.props.declineFriendRequest(request.sender._id, user._id)} className="btn btn-danger btn-sm my-2 my-sm-0">Decline</button>
            </div>);
        });
    }

    render() {

        return (<div>
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <a className="navbar-brand" href="#">
                                {this.props.toggler || ""}
                                <img src={require('./logo.png')} height="60" alt="" />
                            </a>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                <li className="nav-item active">
                                    <a className="nav-link" href="/dashboard">Home <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/dashboard" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    My Courses
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        {this.props.courses.myCourses.map(course => {
                                            return <a key={course._id} className="dropdown-item" href={`/courses/${course._id}`}>{course.name}</a>;
                                        })}
                                    </div>
                                </li>
                                <li className="nav-item">
                                    {this.displayEnrollForm()}
                                </li>
                                <li className="nav-item">
                                    <a style={{cursor: "pointer"}} data-toggle="modal" data-target="#createCourseModal" className="nav-link">Create Course</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/dashboard" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {this.props.friendRequests.requests.length > 0 ? 
                                            <i style={{position: "relative"}} className="fas fa-bell notification"></i> :
                                            <i className="fas fa-bell"></i>
                                        }
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        {this.displayNotifications()}
                                    </div>    
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/dashboard" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.displayWelcome()}
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a className="dropdown-item" href="/profile">My Profile</a>
                                        <a onClick={e => this.props.auth.user ? this.props.fetchFriends(this.props.auth.user._id) : () => 0} data-toggle="modal" data-target="#myFriendsModal" className="dropdown-item">My Friends</a>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    {this.renderContent()}
                                </li>
                            </ul>
                            {this.renderSearchBox()}

                        </div>
                </nav>
           <Modal id="createCourseModal" title="Create Course" body={this.renderCreateCourseForm()} btnOkText="Create" btnCloseText="Cancel" onSubmit={this.createCourse} />
           <Modal id="myFriendsModal" title="My Friends" body={this.displayFriends()} btnCloseText="Close" />
           
           </div>);

    }

    createCourse() {
        const { courseName, courseCategory, courseDescription, courseNumber } = this.state;

        this.props.createCourse({ courseName, courseNumber, courseCategory, courseDescription });
    }

    displayFriends() {

        const { friends } = this.props.friendRequests;
        const { user } = this.props.auth;

        if (!user || !friends || friends.length == 0) {
            return <p>No friends at the moment.</p>;
        }

        return (
            <table className="table table-hover">
                <tbody>
                    {friends.map(friend => {
                        return (
                            <tr key={friend._id} >
                                <td><a href={`/users/${friend._id}`}>{friend.name}</a></td> 
                                <td><button onClick={e => this.props.unfriend(user._id, friend._id)} className="btn btn-danger float-right">Unfriend</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
           
        );
    }

    renderCreateCourseForm() {
        return (
            <form id="createCourseForm">
                <div className="form-group">
                    <label htmlFor="courseName">Course Title *</label>
                    <input value={this.state.courseName} onChange={e => this.setState({courseName: e.target.value})} required type="text" className="form-control" id="courseName" placeholder="i.e. Intro to Programming" />
                </div>
                <div className="form-group">
                    <label htmlFor="courseName">Course Number *</label>
                    <input required value={this.state.courseNumber} onChange={e => this.setState({courseNumber: e.target.value})} type="text" className="form-control" id="courseName" placeholder="i.e. CS 61A" />
                </div>
                <div className="form-group">
                    <label htmlFor="courseCategory">Category *</label>
                    <select required value={this.state.courseCategory} onChange={e => this.setState({courseCategory: e.target.value})} className="form-control" id="courseCategory">
                        <option disabled defaultValue>Choose Category</option>
                        <option value="Reading & Writing">Reading &amp; Writing</option>
                        <option value="History">History</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physical Science">Physical Science</option>
                        <option value="Biological Science">Biological Science</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Music">Music</option>
                        <option value="Visual Arts">Visual Arts</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="courseDescription">Description (1000 chars max) *</label>
                    <textarea required value={this.state.courseDescription} onChange={e => this.setState({courseDescription: e.target.value})} className="form-control" id="courseDescription" maxLength="1000" rows="5"></textarea>
                </div>
            </form>
        );
    }
}

const mapStateToProps = ({auth, courses, friendRequests}) => {
    return { auth, courses, friendRequests }
};

export default connect(mapStateToProps, actions)(Header);