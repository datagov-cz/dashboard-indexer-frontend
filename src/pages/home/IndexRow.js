import React from "react";
import * as Bootstrap from "react-bootstrap";
import UpdateRecord from "./UpdateRecord";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlay, faStop, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import durationToText from "../../DurationToText";
import api from "../../settings";

class IndexRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        }
    }

    render() {
        let rowColor = this.props.rowNumber % 2 ? "table-secondary" : "table-default";
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
                                    <Link to={'/index/' + this.props.data.id}>
                                        <FontAwesomeIcon className="text-dark pointer" icon={faPencilAlt}
                                                         title={"Edit"}/>
                                    </Link>
                                </div>
                                <div className={"m-auto"}
                                     onClick={() => api.post('configs/' + this.props.data.id + (this.props.running == null ? '/start' : '/stop')).catch((error) => {
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
                                     onClick={() => this.props.showDeletePopup(this.props.data.id,this.props.data.name, this.props.data.dashboards, this.props.data.lastSuccessAndLastTenUpdateRecords[0] != null)}
                                >
                                    <FontAwesomeIcon className="text-danger pointer" icon={faTrash} title={"Delete"}/>
                                </div>
                            </div>
                        </td>
                    </tr>
                </Bootstrap.Accordion.Toggle>
                {this.renderRowAdditionInfo(rowColor)}
            </>
        );
    }

    renderRowAdditionInfo(rowColor) {
        let graphData = []
        this.props.data.lastSuccessAndLastTenUpdateRecords.forEach((record, index) => {
            if (index > 0) graphData.push({
                date: new Date(record.lastUpdateStartDate).toLocaleString(),
                [record.finishState]: record.lastUpdateDuration
            })
        });
        return (
            <tbody className={"border-0"}>
            <tr className={rowColor}>
                <td colSpan={5} className={"p-0 m-0 border-0"}>
                    {this.props.data.lastSuccessAndLastTenUpdateRecords.length > 1 ?
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
        )
    }
}

export default IndexRow;