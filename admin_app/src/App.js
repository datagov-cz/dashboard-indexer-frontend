import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';


class IndexRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <th scope={"row"}>{this.props.name}</th>
                <td>{this.props.running ? 'Running' : 'Indexed'}</td>
                <td>Last update</td>
                <td>Duration</td>
                <td>Dashboards</td>
                <td>
                    <Bootstrap.ButtonGroup>
                        <Bootstrap.Button>Edit</Bootstrap.Button>
                        <Bootstrap.Button>Update</Bootstrap.Button>
                        <Bootstrap.Button variant="danger">Delete</Bootstrap.Button>
                    </Bootstrap.ButtonGroup>
                </td>
            </tr>
        );
    }
}

class IndexTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configs: {},
            running: Array(1)
        }
        axios.get('http://localhost:8080/config').then((response) => this.setState({configs: response.data}));
        axios.get('http://localhost:8080/running').then((response) => this.setState({running: response.data}));
    }

    renderRow(key) {
        return (
            <IndexRow name={key} data={this.state.configs[key]} running={this.state.running.includes(key)}/>
        )
    }

    render() {
        return (
            <Bootstrap.Table striped bordered hover>
                <thead>
                <tr>
                    <th scope="col">Index name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last update</th>
                    <th scope="col">Duration of last indexing</th>
                    <th scope="col">Used in</th>
                    <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {Object.keys(this.state.configs).map(key => this.renderRow(key))}
                </tbody>

            </Bootstrap.Table>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <Bootstrap.Container>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <IndexTable/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default App;
