import React from "react";
import * as Bootstrap from "react-bootstrap";
import {Link, Route, withRouter} from "react-router-dom";


class NavBar extends React.Component {

    render() {
        return (
            <Bootstrap.Navbar id="mainNavBar" bg="dark" variant="dark" sticky={"top"}>
                <Bootstrap.Navbar.Brand href="/" className="mr-auto">
                    AdminApp
                </Bootstrap.Navbar.Brand>
                <Route exact path={"/"}>
                    <Link to={'/index'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Create new</Bootstrap.Button>
                    </Link>
                </Route>
            </Bootstrap.Navbar>
        );
    }
}

export default withRouter(NavBar);