import React from "react";
import * as Bootstrap from "react-bootstrap";
import durationToText from "../../DurationToText";


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
export default UpdateRecord;