import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Profile extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const { requestExists } = this.props.friendRequests;

        const { user, otherUser } = nextProps.auth;

        if (user && otherUser && requestExists == 0) {
           this.props.getFriendRequest(user._id, otherUser._id);
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        this.props.fetchUser(id);

    }

    renderFriendRequestButton() {
        const { user, otherUser } = this.props.auth;
        const { request, requestExists } = this.props.friendRequests;

        if (!user || !otherUser || requestExists == 0) {
            return <div></div>;
        }

        if (request && !request.status) {
            return <button type="submit" onClick={e => this.props.cancelFriendRequest(user._id, otherUser._id)} className="btn btn-danger">Cancel Friend Request</button>;
        } else if (request && request.status) {
            return <button type="submit" onClick={e => this.props.unfriend(user._id, otherUser._id)} className="btn btn-danger">Unfriend</button>
        } else {
            return <button type="submit" onClick={e => this.props.sendFriendRequest(user._id, otherUser._id)} className="btn btn-primary">Add Friend</button>;
        }
    }

    render() {
        const { user, otherUser } = this.props.auth;

        if (!user || !otherUser) {
            return <div style={{marginTop: "5vh"}}>Loading...</div>;
        }

        return (
                <div style={{marginTop: "5vh"}}>
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <h2 className="text-center">{otherUser.name}</h2>
                            <br/>
                            <img src={require('./sai-profile-edited.jpg')} className="rounded-circle rounded mx-auto d-block w-50" alt="Profile Picture" />
                            <br/>
                            <center>
                                {this.renderFriendRequestButton()}
                            </center>
                            <br/>
                            <h3><strong>Email:</strong></h3>
                            <h5>{otherUser.email}</h5>
                            <br/>
                            <h3><strong>Bio:</strong></h3>
                            <h5>{otherUser.bio}</h5>
                        </div>
                    </div>
                </div>           
        );
    }
}

const mapStateToProps = ({auth, friendRequests}) => {
    return { auth, friendRequests }
};

export default connect(mapStateToProps, actions)(Profile);