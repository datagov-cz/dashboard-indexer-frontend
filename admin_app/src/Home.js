import React from 'react';
import './Home.css';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlay, faStop, faTrash} from '@fortawesome/free-solid-svg-icons'

function durationToText(duration) {
    let time = duration % 1000 + "ms";
    if ((duration = Math.floor(duration / 1000)) > 0)
        time = duration % 60 + "s " + time;
    if ((duration = Math.floor(duration / 60)) > 0)
        time = duration % 60 + "m " + time;
    if ((duration = Math.floor(duration / 60)) > 0)
        time = duration % 24 + "h " + time;
    if ((duration = Math.floor(duration / 24)) > 0)
        time = duration + "days " + time;
    return time;
}

class UpdateRecord extends React.Component {
    render() {
        let time = durationToText(this.props.updateRecord.lastUpdateDuration)
        return (
            <Bootstrap.Row>
                <Bootstrap.Col lg={6}>
                    <Bootstrap.Col className="p-0">
                        <Bootstrap.Badge
                            variant={this.props.updateRecord.finishState === "SUCCESS" ? "success" : (this.props.updateRecord.finishState === "STOPPED" ? "dark" : "danger")}> {this.props.updateRecord.finishState}</Bootstrap.Badge>
                    </Bootstrap.Col>
                    <Bootstrap.Col className="p-0">
                        {new Date(this.props.updateRecord.lastUpdateStartDate).toLocaleString()}
                    </Bootstrap.Col>
                </Bootstrap.Col>
                <Bootstrap.Col lg={6}>
                    <Bootstrap.Col className={"text-lg-right font-weight-bold p-0"}>
                        Duration:
                    </Bootstrap.Col>
                    <Bootstrap.Col className={"text-lg-right p-0"}>
                        {time}
                    </Bootstrap.Col>
                </Bootstrap.Col>
            </Bootstrap.Row>
        )
    }

}

class IndexRow extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        }
    }

    render() {
        let rowColor = this.props.rowNumber % 2 ? "table-secondary" : "table-default";
        let graphData = []
        this.props.data.lastSuccessAndLastTenUpdateRecords.forEach((record, index) => {
            if (index > 0) graphData.push({
                date: new Date(record.lastUpdateStartDate).toLocaleString(),
                [record.finishState]: record.lastUpdateDuration
            })
        });
        return (<>
                <Bootstrap.Accordion.Toggle as={"tbody"} className={"border-0"} eventKey={this.props.data.name}>
                    <tr className={rowColor}>
                        <th scope={"row"}>{this.props.data.name}</th>
                        <td>{this.props.running == null ? (this.props.data.lastSuccessAndLastTenUpdateRecords[0] ? 'Indexed' : 'Not indexed') : (<>
                            <Bootstrap.Spinner size="sm" animation="border"/> {this.props.running}</>)}</td>
                        <td className={"pt-1 pb-1"}>
                            {this.props.data.lastSuccessAndLastTenUpdateRecords.length <= 1 ? 'Not updated yet' :
                                <UpdateRecord updateRecord={this.props.data.lastSuccessAndLastTenUpdateRecords[1]}/>}
                        </td>
                        <td>
                            {Object.keys(this.props.data.dashboards).map(dashboard => {
                                return (
                                    <div key={dashboard} className={"d-flex justify-content-center"}>
                                        <div className={"pointer"}
                                             onClick={(e) => {
                                                 e.stopPropagation();
                                                 window.open(this.props.kibana + dashboard, '_blank')
                                             }}>
                                            {this.props.data.dashboards[dashboard]}&#160;
                                            <svg height="1em" width="1em" viewBox="0 200 1024 768"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M640 768H128V257.90599999999995L256 256V128H0v768h768V576H640V768zM384 128l128 128L320 448l128 128 192-192 128 128V128H384z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                            <div className={"d-flex justify-content-center"}>
                                <div className={"m-auto"}>
                                    <Link to={'/index/' + this.props.data.name}>
                                        <FontAwesomeIcon className="text-dark pointer" icon={faPencilAlt}
                                                         title={"Edit"}/>
                                    </Link>
                                </div>
                                <div className={"m-auto"}
                                     onClick={() => axios.post('http://localhost:8080/api/config/' + this.props.data.name + (this.props.running == null ? '/start' : '/stop'))}>
                                    {this.props.running == null ?
                                        <FontAwesomeIcon className="text-dark pointer" icon={faPlay} title={"Index"}/> :
                                        <FontAwesomeIcon className="text-dark pointer" icon={faStop}
                                                         title={"Stop indexation"}/>}
                                </div>
                                <div className={"m-auto"}
                                     onClick={() => axios.delete('http://localhost:8080/api/config/' + this.props.data.name)}
                                >
                                    <FontAwesomeIcon className="text-danger pointer" icon={faTrash} title={"Delete"}/>
                                </div>
                            </div>
                        </td>
                    </tr>
                </Bootstrap.Accordion.Toggle>
                <tbody className={"border-0"}>
                <tr className={rowColor}>
                    <td colSpan={5} className={"p-0 m-0 border-0"}>
                        <Bootstrap.Accordion.Collapse eventKey={this.props.data.name}
                                                      onExiting={() => this.setState({open: false})}
                                                      onEntered={() => this.setState({open: true})}>
                            <Bootstrap.Row className="p-2">
                                <Bootstrap.Col>
                                    <Bootstrap.Card>
                                        <Bootstrap.Card.Body>
                                            <Bootstrap.Card.Title>Last success update:</Bootstrap.Card.Title>
                                            <Bootstrap.Card.Text>
                                                {this.props.data.lastSuccessAndLastTenUpdateRecords[0] ?
                                                    new Date(this.props.data.lastSuccessAndLastTenUpdateRecords[0].lastUpdateStartDate).toLocaleString()
                                                    : "Never"}
                                                <br/>
                                                {this.props.data.lastSuccessAndLastTenUpdateRecords[0] ?
                                                    "Duration: " + durationToText(this.props.data.lastSuccessAndLastTenUpdateRecords[0].lastUpdateDuration)
                                                    : ""}
                                            </Bootstrap.Card.Text>
                                        </Bootstrap.Card.Body>
                                    </Bootstrap.Card>
                                    <Bootstrap.Card>
                                        <Bootstrap.Card.Header>Last updates:</Bootstrap.Card.Header>
                                        <Bootstrap.Card.Body>
                                            <Bootstrap.ListGroup variant="flush">
                                                {this.props.data.lastSuccessAndLastTenUpdateRecords.map((record, index) => {
                                                    if (index === 0) return "";
                                                    return (
                                                        <Bootstrap.ListGroup.Item key={index} className={"p-0"}>
                                                            <UpdateRecord updateRecord={record}/>
                                                        </Bootstrap.ListGroup.Item>
                                                    )
                                                })}
                                            </Bootstrap.ListGroup>
                                        </Bootstrap.Card.Body>
                                    </Bootstrap.Card>
                                </Bootstrap.Col>
                                <Bootstrap.Col>
                                    <ResponsiveContainer width={this.state.open ? "100%" : "10"} height="100%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={graphData}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="date" reversed="true"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="SUCCESS" stackId={"a"} fill="#28a745"/>
                                            <Bar dataKey="STOPPED" stackId={"a"} fill="#000000"/>
                                            <Bar dataKey="FAILED" stackId={"a"} fill="#DC3545"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Bootstrap.Col>
                            </Bootstrap.Row>
                        </Bootstrap.Accordion.Collapse>
                    </td>
                </tr>
                </tbody>
            </>
        );
    }
}

class IndexTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configs: Array(1),
            running: {},
            configsInterval: setInterval(() => axios.get('http://localhost:8080/api/configs').then((response) => this.setState({configs: response.data})), 10 * 1000),
            runningInterval: setInterval(() => axios.get('http://localhost:8080/api/running').then((response) => this.setState({running: response.data})), 1000)
        }
        axios.get('http://localhost:8080/api/kibanaHost').then((response) => this.setState({dashBoardAddress: response.data + "/app/dashboards#/view/"}))
        axios.get('http://localhost:8080/api/configs').then((response) => this.setState({configs: response.data}))
        axios.get('http://localhost:8080/api/running').then((response) => this.setState({running: response.data}));
    }

    componentWillUnmount() {
        clearInterval(this.state.configsInterval);
        clearInterval(this.state.runningInterval);
    }

    renderRow(indexInfo, rowNumber) {
        return (
            <IndexRow key={indexInfo.name} rowNumber={rowNumber} data={indexInfo} kibana={this.state.dashBoardAddress}
                      running={this.state.running[indexInfo.name]}/>
        );
    }

    render() {
        return (
            <Bootstrap.Accordion>
                <Bootstrap.Table responsive="lg" bordered>
                    <thead className={"thead-dark"}>
                    <tr>
                        <th scope="col">Index name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Last update</th>
                        <th scope="col">Used in</th>
                        <th scope="col">Controls</th>
                    </tr>
                    </thead>
                    {this.state.configs.map((indexInfo, rowNumber) => this.renderRow(indexInfo, rowNumber))}
                </Bootstrap.Table>
            </Bootstrap.Accordion>
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
