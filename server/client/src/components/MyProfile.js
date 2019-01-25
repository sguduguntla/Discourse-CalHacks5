import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            bio: ""
        }

        this.saveUserInfo = this.saveUserInfo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.auth.user && nextProps.auth.user) {
            this.setState({name: nextProps.auth.user.name, email: nextProps.auth.user.email, bio: nextProps.auth.user.bio});
        }

        if (!this.props.auth.message && nextProps.auth.message) {
            alert(nextProps.auth.message);
        }
    }

    saveUserInfo(e) {
        e.preventDefault();

        const {name, bio} = this.state;

        this.props.updateUser(this.props.auth.user._id, {name, bio});
    }

    render() {
        const { user } = this.props.auth;

        if (!user) {
            return <div style={{marginTop: "5vh"}}>Loading...</div>;
        }

        return (
                <div style={{marginTop: "5vh"}}>
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <h2 className="text-center">{user.name}</h2>
                            <br/>
                            <img src={require('./sai-profile-edited.jpg')} className="rounded-circle rounded mx-auto d-block w-50" alt="Profile Picture" />
                            <br/>
                            <form onSubmit={this.saveUserInfo}> 
                                <div className="form-group">
                                    <label htmlFor="userName">Name</label>
                                    <input name="userName" className="form-control" type="text" value={this.state.name} onChange={e => this.setState({name: e.target.value})} />    
                                </div>
                                <p>Email:</p>
                                <h5>{user.email}</h5>
                                <br/>
                                <div className="form-group">
                                    <label htmlFor="userBio">Bio (1000 char max)</label>
                                    <textarea name="userBio" className="form-control" maxLength="1000" rows="5" value={this.state.bio} onChange={e => this.setState({bio: e.target.value})}></textarea>
                                </div>
                                <center><button type="submit" className="btn btn-primary">Save</button></center>
                            </form>
                        </div>
                    </div>
                </div>           
        );
    }
}

const mapStateToProps = ({auth}) => {
    return { auth }
};

export default connect(mapStateToProps, actions)(MyProfile);