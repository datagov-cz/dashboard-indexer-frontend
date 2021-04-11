import React from "react";
import * as Bootstrap from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from "axios";

class RAW extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readOnly: true,
            config: {}
        }

        if (this.props.name) axios.get('http://192.168.0.101:8080/config/' + this.props.name).then((response) => this.setState({config: response.data}))
    }

    render() {
        return (
            <Bootstrap.Form>
                <Bootstrap.Form.Check type="checkbox" label="Read only" checked={this.state.readOnly}
                                      onChange={(event) => this.setState({readOnly: event.target.checked})}/>
                <Bootstrap.Form.Control rows={20} as={"textarea"} readOnly={this.state.readOnly}
                                        value={JSON.stringify(this.state.config, null, 7)}/>
            </Bootstrap.Form>
        )
    }
}

class Tabs extends React.Component {
    render() {
        return (
            <Bootstrap.Tabs defaultActiveKey="raw">
                <Bootstrap.Tab eventKey="interactive" title="Interactive">

                </Bootstrap.Tab>
                <Bootstrap.Tab eventKey="raw" title="RAW">
                    <RAW name={this.props.name}/>
                </Bootstrap.Tab>
            </Bootstrap.Tabs>
        )
    }
}

class Edit extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>
                            {"Edit"}
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <Tabs name={this.props.match.params.name}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default withRouter(Edit);