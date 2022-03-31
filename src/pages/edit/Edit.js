import React from "react";
import * as Bootstrap from "react-bootstrap";
import "./Edit.css";
import {withRouter} from "react-router-dom";
import Tabs from './Tabs.js'

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>
                            {this.props.match.params.id ? "Editing: " + this.state.name : "New index"}
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <Tabs addAlert={this.props.addAlert} match={this.props.match} history={this.props.history}
                              id={this.props.match.params.id} parent={this}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}


export default withRouter(Edit);