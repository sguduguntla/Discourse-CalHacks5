import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enroll: false,
            classKey: ''
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.changeEnrollState = this.changeEnrollState.bind(this);
        this.enrollSubmit = this.enrollSubmit.bind(this);
    }
    
    renderContent() {
        console.log(this.props.auth);

        switch(this.props.auth) {
            case null:
                return;
            case false:
                return <button className="btn btn-danger"><a className="text-white" style={{textDecoration: "none"}} href="/auth/google/">Login with Google</a></button>;
            default:
                return <button className="btn btn-danger"><a className="text-white" style={{textDecoration: "none"}} href="/api/logout">Logout</a></button>;
        }
    }

    displayWelcome() {
        if (this.props.auth) {
            return " " + this.props.auth.name.split(" ")[0];
        } else {
            return "";
        }
    }

    changeEnrollState(e) {
        e.preventDefault();
        this.setState({enroll: !this.state.enroll});
    }

    handleTextChange(e) {
        this.setState({classKey: e.target.value});
    }

    enrollSubmit(e) {
        e.preventDefault();
        this.props.enrollInclassName({classKey: this.state.classKey, user: this.props.auth}, (result) => {
            if (result) {
                if (result.message) {
                    alert(result.message);
                } else {
                    alert(result.error);
                }
            }
        });
    }

    displayEnrollForm() {
        if (this.state.enroll) {
            return (<form onSubmit={this.enrollSubmit} className="form-inline">
                <input value={this.state.classKey} onChange={this.handleTextChange} className="form-control mr-sm-2 input-sm" type="input" placeholder="Enter class key" aria-label="Search"/>
                <button className="btn btn-success btn-sm my-2 mr-sm-2 my-sm-0" type="submit">Enroll</button>
                <button onClick={this.changeEnrollState} className="btn btn-danger btn-sm my-2 my-sm-0">Hide</button>
            </form>);
        }
       
        return <a onClick={this.changeEnrollState} className="nav-link" href="#">Enroll in a class</a>;
    }

    renderModal() {
            return (<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>);
    }

    render() {
        return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            {this.renderModal()}
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <a className="navbar-brand" href="#">Disquorse</a>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <a className="nav-link" href="/dashboard">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        {this.displayEnrollForm()}
                    </li>
                    <li className="nav-item">
                        <a data-toggle="modal" data-target="#exampleModal" className="nav-link" href="#">Create Course</a>
                    </li>
                </ul>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Welcome{this.displayWelcome()}!</a>
                    </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                    {this.renderContent()}
                </form>
            </div>
        </nav>);
    }
}

const mapStateToProps = ({auth}) => {
    return { auth }
};

export default connect(mapStateToProps, actions)(Header);