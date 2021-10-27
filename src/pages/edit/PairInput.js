import * as Bootstrap from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import AddRowButton from "./AddRowButton";
import React from "react";

class PairInput extends React.Component {
    render() {
        return (
                <Bootstrap.Col md={10}>
                    {this.props.data.map((pair, index) => {
                        return (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"w-100"}>
                                    <Bootstrap.Row>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control
                                                placeholder={this.props.placeholder1}
                                                value={pair[0]}
                                                onChange={(e) => {
                                                    e.target.classList.remove('is-invalid');
                                                    this.props.parent.setState(prev => {
                                                        prev[this.props.dataName][index][0] = e.target.value;
                                                        return {[this.props.dataName]: prev[this.props.dataName]};
                                                    })
                                                }}/>
                                        </Bootstrap.Col>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control
                                                placeholder={this.props.placeholder2}
                                                value={pair[1]}
                                                onChange={(e) => {
                                                    e.target.classList.remove('is-invalid');
                                                    this.props.parent.setState(prev => {
                                                        prev[this.props.dataName][index][1] = e.target.value;
                                                        return {[this.props.dataName]: prev[this.props.dataName]};
                                                    })
                                                }}/>
                                        </Bootstrap.Col>
                                    </Bootstrap.Row>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"} icon={faMinusCircle}
                                                     title={"Remove"} onClick={() => this.props.parent.setState((prev) => {
                                        prev[this.props.dataName].splice(index, 1);
                                        return {[this.props.dataName]: prev[this.props.dataName]}
                                    })}/>
                                </div>
                            </div>
                        )
                    })}
                    <AddRowButton length={this.props.data.length}
                                  onClick={() => this.props.parent.setState(prev => ({[this.props.dataName]: prev[this.props.dataName].concat([["", ""]])}))}/>
                </Bootstrap.Col>
        )
    }
}


export default PairInput;