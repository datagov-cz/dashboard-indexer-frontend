import * as Bootstrap from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUndoAlt} from "@fortawesome/free-solid-svg-icons";
import React from "react";
class RawTab extends React.Component {
    render() {
        return (
            <Bootstrap.Form method={"post"} onSubmit={(e) => this.props.parent.checkValidity(e)}>
                {this.props.parent.createSaveButtons()}
                <Bootstrap.Row>
                    <Bootstrap.Col className={"d-flex align-items-center"}>
                        <Bootstrap.Form.Check className={"m-2"} type="checkbox" label="Read only"
                                              checked={this.props.parent.state.readOnly}
                                              onChange={(event) => {
                                                  if (event.target.checked) this.showPopupForConvertConfigRawToVars();
                                                  else this.props.parent.setState({readOnly: false});
                                              }}/>
                    </Bootstrap.Col>
                    <Bootstrap.Col className={"d-flex justify-content-end"}>
                        <Bootstrap.Button className={"m-2"} disabled={this.props.parent.state.readOnly} variant={"warning"}
                                          onClick={() => this.props.parent.setState({configRaw: JSON.stringify(this.props.parent.state.config, null, 7)})}>
                            Revert changes <FontAwesomeIcon icon={faUndoAlt}/></Bootstrap.Button>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Form.Control rows={25} as={"textarea"} readOnly={this.props.parent.state.readOnly}
                                        value={this.props.parent.state.configRaw}
                                        onChange={(e) => this.props.parent.setState({configRaw: e.target.value})}
                />
            </Bootstrap.Form>
        )
    }
    
    showPopupForConvertConfigRawToVars() {
        if (this.props.parent.state.readOnly) return
        this.props.parent.setState({askToConvertRawToVars: true})
    }
}
export default RawTab;