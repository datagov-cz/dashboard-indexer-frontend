import React from 'react';
import './Home.css';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';


class IndexRow extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props.data.lastTenUpdateRecords);

    }

    render() {
        return (
            <tr>
                <th scope={"row"}>{this.props.data.name}</th>
                <td>{this.props.running == null ? 'Indexed' : this.props.running}</td>
                <td>{this.props.data.lastTenUpdateRecords.length === 0 ? 'Not yet indexed' : this.props.data.lastTenUpdateRecords[0].lastUpdateStartDate + " " + this.props.data.lastTenUpdateRecords[0].lastUpdateDuration + "ms " + this.props.data.lastTenUpdateRecords[0].finishState}
                </td>
                <td>{this.props.data.dashboards.map(dashboard => dashboard + ", ")}</td>
                <td className={'text-center'}>
                    <Bootstrap.ButtonGroup>
                        <Link to={'/index/' + this.props.data.name}>
                            <Bootstrap.Button>Edit</Bootstrap.Button>
                        </Link>
                        <Bootstrap.Button
                            onClick={() => axios.post('http://localhost:8080/config/' + this.props.data.name + (this.props.running == null ? '/start' : '/stop'))}>{this.props.running == null ? 'Update' : 'Stop'}</Bootstrap.Button>
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
            running: {}
        }
        {/*TODO: change to SWR  https://swr.vercel.app/getting-started*/
        }
        axios.get('http://192.168.0.101:8080/configs').then((response) => this.setState({configs: response.data}))
        setInterval(() => axios.get('http://192.168.0.101:8080/configs').then((response) => this.setState({configs: response.data})), 10 * 1000);
        axios.get('http://192.168.0.101:8080/running').then((response) => this.setState({running: response.data}));
        setInterval(() => axios.get('http://192.168.0.101:8080/running').then((response) => this.setState({running: response.data})), 1000);
    }

    renderRow(index) {
        return (
            <IndexRow key={index.name} data={index}
                      running={this.state.running[index.name]}/>
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
                    <th scope="col">Used in</th>
                    <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {this.state.configs.map(index => this.renderRow(index))}
                </tbody>

            </Bootstrap.Table>
        )
            ;
    }
}

class Home extends React.Component {
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
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <IndexTable/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default Home;
