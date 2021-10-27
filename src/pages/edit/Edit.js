import React from "react";
import * as Bootstrap from "react-bootstrap";
import "./Edit.css";
import {withRouter} from "react-router-dom";
import Tabs from './Tabs.js'

class Edit extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>
                            {this.props.match.params.name ? "Editing: " + this.props.match.params.name : "New index"}
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <Tabs addAlert={this.props.addAlert} match={this.props.match} history={this.props.history}
                              name={this.props.match.params.name}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}


export default withRouter(Edit);