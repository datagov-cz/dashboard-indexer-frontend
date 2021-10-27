import * as Bootstrap from "react-bootstrap";
import React from "react";

class Cron extends React.Component{
    render() {
        let schedule = this.props.parent.state.schedule;
        let cronRegex = /(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?)/g;
        return (
            <Bootstrap.Card className={"ml-5 mb-2"}>
                <Bootstrap.Card.Body>
                    <Bootstrap.Form.Row className={"align-items-end"}>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Second</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="second"
                                value={schedule[0]}
                                isInvalid={!schedule[0].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[0] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Minute</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="minute"
                                value={schedule[1]}
                                isInvalid={!schedule[1].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[1] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Hour</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="hour"
                                value={schedule[2]}
                                isInvalid={!schedule[2].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[2] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Day of month</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="dayOfMonth"
                                value={schedule[3]}
                                isInvalid={!schedule[3].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[3] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Month</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="month"
                                value={schedule[4]}
                                isInvalid={!schedule[4].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[4] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Day of week</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="dayOfWeek"
                                value={schedule[5]}
                                isInvalid={!schedule[5].match(cronRegex)}
                                onChange={(e) => {
                                    schedule[5] = e.target.value;
                                    this.props.parent.setState({schedule: schedule});
                                }}
                            />
                            {this.renderCronFeedback()}
                        </Bootstrap.Form.Group>
                    </Bootstrap.Form.Row>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }

    renderCronFeedback() {
        return (
            <Bootstrap.Form.Control.Feedback tooltip type="invalid">
                Use cron notation:
                <Bootstrap.Table className={"cronList"} borderless size={"sm"}>
                    <tbody>
                    <tr>
                        <th>*</th>
                        <td className={"ml-1"}>any value</td>
                    </tr>
                    <tr>
                        <th>,</th>
                        <td>value list separator</td>
                    </tr>
                    <tr>
                        <th>-</th>
                        <td>range of values</td>
                    </tr>
                    <tr>
                        <th>/</th>
                        <td>step values</td>
                    </tr>
                    </tbody>
                </Bootstrap.Table>
            </Bootstrap.Form.Control.Feedback>
        )
    }
}
export default  Cron;