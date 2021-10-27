import * as Bootstrap from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import AddRowButton from "./AddRowButton";
import React from "react";

class OneToManyPairInput extends React.Component {
    render() {
        return (
            <Bootstrap.Col md={10}>
                {this.props.data.map((pair, index) => {
                    return (
                        <div key={index} className={"d-flex align-items-center mb-2"}>
                            <div className={"d-flex w-100"}>
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
                                    {pair[1].map((trackedFile, innerIndex) => {
                                        return (
                                            <div className={"d-flex w-100"} key={index + ":" + innerIndex}>
                                                <Bootstrap.Col className={"p-0"}>
                                                    {pair[1].length > 1 ? <FontAwesomeIcon
                                                        className="text-danger pointer position-absolute right-0 mr-1"
                                                        icon={faTimes}
                                                        title={"Remove"}
                                                        onClick={() => this.props.parent.setState((prev) => {
                                                            prev[this.props.dataName][index][1].splice(innerIndex, 1);
                                                            return {[this.props.dataName]: prev[this.props.dataName]}
                                                        })}/> : ""}
                                                    <Bootstrap.Form.Control className={"mb-2"}
                                                                            placeholder={this.props.placeholder2}
                                                                            value={trackedFile}
                                                                            onChange={(e) => {
                                                                                e.target.classList.remove('is-invalid');
                                                                                this.props.parent.setState(prev => {
                                                                                    prev[this.props.dataName][index][1][innerIndex] = e.target.value;
                                                                                    return {[this.props.dataName]: prev[this.props.dataName]};
                                                                                })
                                                                            }}/>
                                                </Bootstrap.Col>
                                            </div>
                                        )
                                    })}
                                    <Bootstrap.Button variant={"outline-success"}
                                                      onClick={() => {
                                                          this.props.parent.setState(prev => {
                                                              prev[this.props.dataName][index][1] = prev[this.props.dataName][index][1].concat([""]);
                                                              return {[this.props.dataName]: prev[this.props.dataName]};
                                                          });
                                                      }}>Add copy</Bootstrap.Button>
                                </Bootstrap.Col>
                            </div>
                            <div className={"m-2"}>
                                <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                 icon={faMinusCircle}
                                                 title={"Remove"}
                                                 onClick={() => this.props.parent.setState((prev) => {
                                                     prev[this.props.dataName].splice(index, 1);
                                                     return {[this.props.dataName]: prev[this.props.dataName]}
                                                 })}/>
                            </div>
                        </div>
                    )
                })}
                <AddRowButton length={this.props.data.length} onClick={() => {
                    this.props.parent.setState(prev => ({[this.props.dataName]: prev[this.props.dataName].concat([["", [""]]])}));
                }}/>
            </Bootstrap.Col>
        )
    }
}


export default OneToManyPairInput;