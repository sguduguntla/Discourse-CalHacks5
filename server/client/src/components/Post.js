import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import moment from 'moment';
import Linkify from 'linkifyjs/react';

class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            numLikes: this.props.post.likes
        }

        this.handleLike = this.handleLike.bind(this);
    }

    convertToCurrentTime(timestamp) {

        const now = moment()
        const postedTime = moment(timestamp);

        // get the difference between the moments
        const diff = now.diff(postedTime);

        //express as a duration
        const diffDuration = moment.duration(diff);

        // display
        var yearDiff = diffDuration.years();
        var monthDiff = diffDuration.months();
        var weekDiff = diffDuration.weeks();
        var dayDiff = diffDuration.days();
        var hourDiff = diffDuration.hours();
        var minutesDiff = diffDuration.minutes();
        var secondsDiff = diffDuration.seconds();

        if (yearDiff >= 2) {
            return yearDiff + " years ago ";
        } else if (yearDiff >= 1) {
            return "1 year ago ";
        } else if (monthDiff >= 2) {
            return monthDiff + " months ago "
        } else if (monthDiff >= 1) {

            return "1 month ago ";

        } else if (weekDiff >= 2) {
            return weekDiff + " weeks ago "
        } else if (weekDiff >= 1) {
            return "1 week ago "

        } else if (dayDiff >= 2) {
            return dayDiff + " days ago"
        } else if (dayDiff >= 1) {
            return "1 day ago"

        } else if (hourDiff >= 2) {

            return hourDiff + " hours ago "

        } else if (hourDiff >= 1) {
            if (minutesDiff > 0) {
                return "1 hour, " + Math.abs((minutesDiff - (60 * hourDiff))) + " mins ago "
            } else {
                return "1 hour ago "
            }
        } else if (minutesDiff >= 2) {

            return minutesDiff + " mins ago "

        } else if (minutesDiff >= 1) {

            return "1 minute ago "

        } else if (secondsDiff >= 2) {

            return secondsDiff + " secs ago "

        } else if (secondsDiff >= 1) {

            return "1 second ago "

        }

        return "just now"

    }

    componentDidMount() {
        if (this.props.user && this.props.post.likedBy.includes(this.props.user._id) && !this.state.liked) {
            this.setState({ liked: true });
        }
    }

    handleLike(e) {
        this.props.likePost({postId: this.props.post._id, userId: this.props.user._id, liked: this.state.liked});
        
        if (!this.state.liked) {
            this.setState({ liked: !this.state.liked, numLikes: this.state.numLikes + 1 });
        } else {
            this.setState({ liked: !this.state.liked, numLikes: this.state.numLikes - 1 });
        }
    }

    render() {
        const { post, user } = this.props;

        if (!post || !user) {
            return <div>Loading...</div>
        }

        return (
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title">{post._author.name} {post._author._id === user._id ? '(me)' : ''}
                        <div className="btn-group float-right">
                            <button className="btn btn-link text-dark dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-cog"></i>
                            </button>
                            <div className="dropdown-menu">
                                {post._author._id === user._id ? <button className="dropdown-item" onClick={e => this.props.deletePost(this.props.user._id, post._id)} type="button">Delete</button> : '' }
                            </div>
                        </div>
                    </h6>
                    <p className="card-text">
                    {post.topics.map((topic, idx) => {
                        return <span key={idx} className="badge badge-pill badge-primary">{topic}</span>;
                    })}</p>
                    <p className="card-text"><Linkify>{post.content}</Linkify></p>
                    <p className="card-text"><small className="text-muted">Last updated {this.convertToCurrentTime(post.updatedAt)}</small></p>
                </div>
                <div className="card-footer">
                    <p className="card-text"><small className="text-muted"><a style={{cursor: "pointer"}} onClick={this.handleLike}>{this.state.liked ? "Unlike" : "Like"} </a><span>({this.state.numLikes})</span></small></p>
                </div>
            </div>
        );
    }
}

export default connect(null, actions)(Post);