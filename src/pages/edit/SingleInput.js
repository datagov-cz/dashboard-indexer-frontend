import * as Bootstrap from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import AddRowButton from "./AddRowButton";
import React from "react";

class SingleInput extends React.Component {
    render() {
        return (
            <Bootstrap.Col md={10}>
                {this.props.data.map((address, index) => (
                    <div key={index} className={"d-flex align-items-center mb-2"}>
                        <div className={"w-100"}>
                            <Bootstrap.Form.Control
                                placeholder={this.props.placeholder}
                                value={address}
                                onChange={(e) => {
                                    e.target.classList.remove('is-invalid');
                                    this.props.parent.setState(prev => {
                                        prev[this.props.dataName][index] = e.target.value;
                                        return {[this.props.dataName]: prev[this.props.dataName]};
                                    })
                                }}/>
                        </div>
                        <div className={"m-2"}>
                            <FontAwesomeIcon className="text-danger pointer" size={"lg"} icon={faMinusCircle}
                                             title={"Remove"} onClick={() => this.props.parent.setState((prev) => {
                                prev[this.props.dataName].splice(index, 1);
                                return {[this.props.dataName]: prev[this.props.dataName]}
                            })}/>
                        </div>
                    </div>
                ))}
                <AddRowButton length={this.props.data.length} onClick={() => {
                    this.props.parent.setState(prev => ({[this.props.dataName]: prev[this.props.dataName].concat([""])}));
                }}/>
            </Bootstrap.Col>    
        )
    }
}


export default SingleInput;