import React from 'react';
import './Home.css';
import * as Bootstrap from 'react-bootstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faPencilAlt, faPlay, faStop, faTrash} from '@fortawesome/free-solid-svg-icons';

const api = axios.create({baseURL: 'http://localhost:8080/api/'});

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
                    <Bootstrap.Col className="p-0 text-lg-left">
                        <Bootstrap.Badge
                            variant={this.props.updateRecord.finishState === "SUCCESS" ? "success" : (this.props.updateRecord.finishState === "STOPPED" ? "dark" : "danger")}> {this.props.updateRecord.finishState}</Bootstrap.Badge>
                    </Bootstrap.Col>
                    <Bootstrap.Col className="p-0 text-lg-left">
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
    constructor(props, context) {
        super(props, context);
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
                        <th scope={"row"}><h4 className={"m-0"}>{this.props.data.name}</h4></th>
                        <td>{this.props.running == null ? (this.props.data.lastSuccessAndLastTenUpdateRecords[0] ? 'Indexed' : 'Not indexed') : (<>
                            <Bootstrap.Spinner size="sm" animation="border"/> {this.props.running}</>)}</td>
                        <td className={"pt-1 pb-1 text-center"}>
                            <div className={"justify-content-center"}>
                                {this.props.data.lastSuccessAndLastTenUpdateRecords.length <= 1 ?
                                    <h4><Bootstrap.Badge variant={"warning"}>Not updated yet</Bootstrap.Badge></h4> :
                                    <UpdateRecord
                                        updateRecord={this.props.data.lastSuccessAndLastTenUpdateRecords[1]}/>}
                            </div>
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
                                     onClick={() => api.post('configs/' + this.props.data.name + (this.props.running == null ? '/start' : '/stop')).catch((error) => {
                                         this.props.addAlert({
                                             variant: "danger",
                                             title: "Start/stop request error",
                                             message: error,
                                             durationSec: 300
                                         })
                                     })}>
                                    {this.props.running == null ?
                                        <FontAwesomeIcon className="text-dark pointer" icon={faPlay} title={"Index"}/> :
                                        <FontAwesomeIcon className="text-dark pointer" icon={faStop}
                                                         title={"Stop indexation"}/>}
                                </div>
                                <div className={"m-auto"}
                                     onClick={() => this.props.showDeletePopup(this.props.data.name, this.props.data.dashboards, this.props.data.lastSuccessAndLastTenUpdateRecords[0] != null)}
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
                        {this.props.data.lastSuccessAndLastTenUpdateRecords[0] ?
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
                            </Bootstrap.Accordion.Collapse> : ""
                        }
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
            configsInterval: setInterval(() => this.loadIndexes(), 10 * 1000),
            runningInterval: setInterval(() => this.loadRunningIndexes(), 1000),
            deletePopupShow: false
        }
        api.get('kibanaHost').then((response) => this.setState({dashBoardAddress: response.data + "/app/dashboards#/view/"})).catch(() => {
            clearInterval(this.state.runningInterval);
            this.setState({runningInterval: false});
        });
        this.loadIndexes();
    }

    loadIndexes() {
        api.get('configs').then((response) => {
            this.setState({
                configs: response.data,
            })
            if (!this.state.runningInterval) {
                this.props.addAlert({
                    variant: "success",
                    title: "Reconnected",
                    message: "Reconnected to api server",
                    durationSec: 5
                })
                this.setState({
                    runningInterval: setInterval(() => this.loadRunningIndexes(), 1000)
                })
                api.get('kibanaHost').then((response) => this.setState({dashBoardAddress: response.data + "/app/dashboards#/view/"})).catch(() => {
                    clearInterval(this.state.runningInterval);
                    this.setState({runningInterval: false});
                });
            }

        }).catch(() => {
            this.props.addAlert({
                variant: "danger",
                title: "Connection lost",
                message: "Connection to api server lost",
                durationSec: 9
            })
            clearInterval(this.state.runningInterval);
            this.setState({runningInterval: false});
        })
    }

    loadRunningIndexes() {
        api.get('running').then((response) => this.setState({running: response.data})).catch(() => {
            clearInterval(this.state.runningInterval);
            this.setState({runningInterval: false});
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.configsInterval);
        clearInterval(this.state.runningInterval);
    }

    showDeletePopup(index, dashboards, successFullRun) {
        this.setState({
            deletePopupIndexName: index,
            deletePopupDashboards: dashboards,
            deletePopupSuccessFullRun: successFullRun,
            deletePopupDeleteDataCheck: false,
            deletePopupShow: true
        })
    }

    renderRow(indexInfo, rowNumber) {
        return (
            <IndexRow key={indexInfo.name} showDeletePopup={this.showDeletePopup.bind(this)}
                      addAlert={this.props.addAlert}
                      rowNumber={rowNumber} data={indexInfo} kibana={this.state.dashBoardAddress}
                      running={this.state.running[indexInfo.name]}/>
        );
    }

    renderDeletePopup() {
        return (
            <Bootstrap.Modal centered show={this.state.deletePopupShow}>
                <Bootstrap.Modal.Header className={"text-light bg-danger"}>
                    <Bootstrap.Modal.Title>
                        {"Deleting index: " + this.state.deletePopupIndexName}
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body className={"text-light bg-danger"}>
                    {(this.state.deletePopupDashboards && Object.keys(this.state.deletePopupDashboards).length > 0 && this.state.deletePopupSuccessFullRun) ? <>
                        Deleting index '{this.state.deletePopupIndexName}' will affect these dashboards:
                        <br/>
                        <ul>
                            {Object.keys(this.state.deletePopupDashboards).map(dashboardName =>
                                <li key={dashboardName}>{this.state.deletePopupDashboards[dashboardName]}</li>)}
                        </ul>
                    </> : ""}
                    Are you sure you want to delete this index?
                </Bootstrap.Modal.Body>
                <Bootstrap.Modal.Footer
                    className={this.state.deletePopupSuccessFullRun ? "justify-content-between" : ""}>
                    {this.state.deletePopupSuccessFullRun ?
                        <Bootstrap.Form.Switch label={'Also delete indexed data'}
                                               checked={this.state.deletePopupDeleteDataCheck}
                                               id="deletePopupDeleteDataCheck"
                                               onChange={(e) => this.setState({deletePopupDeleteDataCheck: e.target.checked})}/> : ""}
                    <div>
                        <Bootstrap.Button className={"mr-2"} variant="secondary"
                                          onClick={() => this.setState({deletePopupShow: false})}>
                            No
                        </Bootstrap.Button>
                        <Bootstrap.Button variant="danger" onClick={() => {
                            api.delete('configs/' + this.state.deletePopupIndexName, {
                                params: {
                                    deleteData: this.state.deletePopupDeleteDataCheck
                                }
                            }).then(() => this.loadIndexes()).catch((error) => this.props.addAlert({
                                variant: "danger",
                                title: "Delete request error",
                                message: error,
                                durationSec: 300
                            }))
                            this.setState({deletePopupShow: false})
                        }}>
                            Yes, delete
                        </Bootstrap.Button>
                    </div>
                </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>)
    }

    renderStatus() {
        return (
            <div className={"float-right"}>
                Status: {this.state.runningInterval ?
                <FontAwesomeIcon className={"text-success"} icon={faCircle} title={"on-line"}/> :
                <Bootstrap.Spinner size="sm" variant={"danger"} animation={"grow"}/>}
            </div>
        )
    }

    render() {
        return (
            <>
                {this.renderStatus()}
                {this.renderDeletePopup()}
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
            </>
        )
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
                        <IndexTable {...this.props}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default Home;
