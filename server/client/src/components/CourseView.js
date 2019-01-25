import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Post from './Post';
import Modal from './Modal';
import Textarea from 'react-textarea-autosize';

class CourseView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: "0",
            topics: [],
            topic: "",
            content: ""
        }

        this.addTopic = this.addTopic.bind(this);
        this.makeNewPost = this.makeNewPost.bind(this);
        this.getCourseStudents = this.getCourseStudents.bind(this);

    }

    componentDidMount() {
        const { id } = this.props.match.params;

        this.props.fetchCourse(id);

        this.props.fetchPostsByCourse(id);
    }

    addTopic(e) {
        e.preventDefault();
        this.setState({topics: [...this.state.topics, this.state.topic], topic: ""});

    }

    makeNewPost(e) {
        const { id } = this.props.match.params;

        if (this.state.content !== "") {
            this.props.createPost({
                topics: this.state.topics,
                content: this.state.content,
                _author: this.props.auth.user._id,
                course: id
            });

            this.setState({
                topic: "",
                topics: [],
                content: ""
            });
        } else {
            alert("Cannot share empty message.");
        }
    }

    getCourseStudents(e) {
        this.props.fetchStudentsInCourse(this.props.course._id);
        this.props.fetchFriends(this.props.auth.user._id);
    }

    renderStudentsInCourse() {
        const { friends } = this.props.friendRequests;

        const friendIds = friends.map(friend => friend._id);
        
        return (
            <div className="list-group">
                {this.props.students.map(student => {
                    return <a key={student._id} href={`/users/${student._id}`} className="list-group-item list-group-item-action">{student.name} 
                        {friendIds.includes(student._id) ? <span className="badge badge-primary float-right">FRIEND</span> : ''}
                    </a>;
                })}
            </div>
        );
    }

    render() {
        const { course, posts } = this.props;

        if (!course || !posts) {
            return <div style={{marginTop: "5vh"}}>Loading...</div>;
        }

        return (
            <div id="posts">
                <div className="row">
                    <div className="col-md-6">
                        <button onClick={this.getCourseStudents} id="getCourseStudents" data-toggle="modal" data-target="#getCourseStudentsModal" className="btn btn-primary">See Students</button>
                        <Modal id="getCourseStudentsModal" title="All Students" body={this.renderStudentsInCourse()} btnCloseText="Close" />
                    </div>
                    <div className="col-md-6">
                        <div id="postContainer">
                            <div className="card">
                                <div className="card-header">
                                    New Post
                                </div>
                                <div className="card-body">
                                    <Textarea id="newPost" required value={this.state.content} onChange={e => this.setState({content: e.target.value})}  placeholder="Share Something" inputRef={tag => this.textarea = tag} className="form-control" minRows={6} />
                                    <div id="topicBadges">
                                        {this.state.topics.map((topic, idx) => {
                                            return <span key={idx} className="badge badge-pill badge-primary">{topic}</span> ;
                                        })}
                                    </div>
                                    <form onSubmit={this.addTopic}>
                                        <input value={this.state.topic} onChange={e => this.setState({topic: e.target.value})} placeholder="Choose Topics" id="topicChooser" className="form-control" type="text" />
                                    </form>
                                    <button onClick={this.makeNewPost} className="btn btn-default float-right"><i style={{fontSize: "2em"}} className="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                            {posts.map(post => {
                                return <Post key={post._id} user={this.props.auth.user} post={post} />
                            })}
                        </div>
                    </div>
                </div>
                
            </div>    
        );
    }
}

const mapStateToProps = ({ courses, posts, auth, friendRequests }) => {
    return { students: courses.students, course: courses.course, posts: posts.posts, auth, friendRequests }
}

export default connect(mapStateToProps, actions)(CourseView);