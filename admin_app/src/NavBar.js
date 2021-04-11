import React from "react";
import * as Bootstrap from "react-bootstrap";
import {Link, Route, withRouter} from "react-router-dom";


class NavBar extends React.Component {

    render() {
        return (
            <Bootstrap.Navbar bg="dark" variant="dark">
                <Bootstrap.Navbar.Brand href="#" className="mr-auto">
                    AdminApp
                </Bootstrap.Navbar.Brand>
                <Route exact path={"/"}>
                    <Link to={'/index'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Create new</Bootstrap.Button>
                    </Link>
                </Route>
                <Route exact path={["/index/:name", "/index"]}>
                    <Bootstrap.Button variant={"success"}
                                      className={'mr-3'}>Save{this.props.match.params.name ? "" : " new"}</Bootstrap.Button>
                    <Bootstrap.Button variant={"success"}
                                      className={'mr-3'}>Save and index{this.props.match.params.name ? "" : " new"}</Bootstrap.Button>
                </Route>
            </Bootstrap.Navbar>
        );
    }
}

export default withRouter(NavBar);