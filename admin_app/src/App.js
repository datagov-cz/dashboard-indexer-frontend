import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';


class IndexRow extends React.Component {
    constructor(props) {
        super(props);
        //console.log(props)
    }

    render() {
        return (
            <tr>
                <th scope={"row"}>{this.props.data.name}</th>
                <td>{this.props.running ? 'Running' : 'Indexed'}</td>
                <td>{this.props.data.lastUpdate}</td>
                <td>{this.props.data.duration}</td>
                <td>{this.props.data.dashboards.map(dashboard => dashboard + ", ")}</td>
                <td className={'text-center'}>
                    <Bootstrap.ButtonGroup>
                        {/*TODO: redirect to edit site*/}
                        <Bootstrap.Button onClick={() => alert("todo")}>Edit</Bootstrap.Button>
                        {/*TODO: update button text*/}
                        <Bootstrap.Button
                            onClick={() => axios.post('http://localhost:8080/config/' + this.props.data.name + '/start')}>Update
                            now</Bootstrap.Button>
                        <Bootstrap.Button variant="danger"
                                          onClick={() => axios.delete('http://localhost:8080/config/' + this.props.data.name)}
                        >Delete</Bootstrap.Button>
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
            configs: Array(1),
            running: Array(1)
        }
        axios.get('http://192.168.0.101:8080/config').then((response) => this.setState({configs: response.data}))
        setInterval(() => axios.get('http://192.168.0.101:8080/config').then((response) => this.setState({configs: response.data})), 10000);
        axios.get('http://192.168.0.101:8080/running').then((response) => this.setState({running: response.data}));
        setInterval(() => axios.get('http://192.168.0.101:8080/running').then((response) => this.setState({running: response.data})), 10000);
    }

    renderRow(index) {
        return (
            <IndexRow key={index.name} data={index} running={this.state.running.includes(index.name)}/>
        );
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
                {this.state.configs.map(index => this.renderRow(index))}
                </tbody>

            </Bootstrap.Table>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>
                            Indexes
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row >
                    <Bootstrap.Col>
                        <IndexTable/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col className={'text-right'}>
                        {/*TODO: redirect to create new*/}
                        <Bootstrap.Button variant={"success"} className={'mr-3'} onClick={() => alert("todo")}>Create new</Bootstrap.Button>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default App;
