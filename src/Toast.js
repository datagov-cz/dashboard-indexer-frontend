import React from "react";
import * as Bootstrap from "react-bootstrap";
import {withRouter} from "react-router-dom";


class Toast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            minuteInterval: setInterval(() => {
                this.setState((prev) => ({minuteCount: prev.minuteCount + 1}))
            }, 60000),
            minuteCount: 0
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.minuteInterval)
    }
    getBody(){
        if(typeof this.props.message==="string") return this.props.message;
        if(this.props.message.response?.data?.message) return this.props.message.response.data.message;
        return <pre className={(this.props.variant === "danger" ? "text-light " : "") + "text-break"}>{JSON.stringify(this.props.message, null, 5)}</pre>
    }

    render() {
        return (
            <div>
                <Bootstrap.Toast className={"mt-2 bg-" + this.props.variant} onClose={() => this.setState({show: false})}
                                 show={this.state.show}
                                 delay={this.props.durationSec * 1000}
                                 autohide>
                    <Bootstrap.Toast.Header>
                        <div className="mr-auto font-weight-bold">{this.props.title}</div>
                        <small
                            className={"pl-2"}>{this.state.minuteCount < 1 ? 'few seconds ago' : this.state.minuteCount + (this.state.minuteCount === 1 ? ' minute ago' : ' minutes ago')}</small>
                    </Bootstrap.Toast.Header>
                    <Bootstrap.Toast.Body
                        className={(this.props.variant === "danger" ? "text-light " : "") + "text-break"}>{this.getBody()}</Bootstrap.Toast.Body>
                </Bootstrap.Toast>
            </div>
        );
    }
}

export default withRouter(Toast);