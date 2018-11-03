import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
    renderContent() {
        switch(this.props.auth) {
            case null:
                return;
            case false:
                return <button className="btn btn-danger my-2 my-sm-0" type="submit">Login with Google</button>;
            default:
                return <span className="text-white">Welcome!</span>;
        }
    }

    render() {
        console.log(this.props);
        return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <a className="navbar-brand" href="#">Cal Hacks</a>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Dashboard</a>
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

export default connect(mapStateToProps)(Header);