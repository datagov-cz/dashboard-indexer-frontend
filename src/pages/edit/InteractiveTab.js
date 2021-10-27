import * as Bootstrap from "react-bootstrap";
import React from "react";
import Cron from "./Cron";
import Advanced from "./Advanced";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import AddRowButton from "./AddRowButton";
import SingleInput from "./SingleInput";

class InteractiveTab extends React.Component {
    render() {
        return (
            <Bootstrap.Form method={"post"} onSubmit={(e) => this.props.parent.checkValidity(e)}>
                {this.props.parent.createSaveButtons()}
                <Bootstrap.Card>
                    <Bootstrap.Card.Header>Main:</Bootstrap.Card.Header>
                    <Bootstrap.Card.Body>
                        <Bootstrap.Form.Group as={Bootstrap.Row}>
                            <Bootstrap.Form.Label column md={2}>
                                Index name:
                            </Bootstrap.Form.Label>
                            <Bootstrap.Col md={10}>
                                <Bootstrap.Form.Control placeholder="index-name" value={this.props.parent.state.name}
                                                        readOnly={this.props.parent.props.match.params.name}
                                                        onChange={(e) => {
                                                            e.target.classList.remove('is-invalid');
                                                            if (e.target.value.startsWith("@temp-") || e.target.value.toLowerCase().split("").some(char => "\\/?\"<>|".indexOf(char) !== -1))
                                                                e.target.classList.add('is-invalid');
                                                            this.props.parent.setState({name: e.target.value.toLowerCase()});
                                                        }}
                                />
                                <Bootstrap.Form.Control.Feedback type={"invalid"}>Field is required. Index name can't
                                    start with '@temp-' and can't contain
                                    '{'\\, /, ?, ", <, >, |'}'.</Bootstrap.Form.Control.Feedback>
                            </Bootstrap.Col>
                        </Bootstrap.Form.Group>
                        <fieldset>
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column md={2}>
                                    Index updating:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                                    <Bootstrap.Form.Check
                                        inline
                                        type="radio"
                                        label="Automatic"
                                        name="updatingRadio"
                                        id="updatingAutomatic"
                                        checked={this.props.parent.state.automatic}
                                        onChange={(e) => this.props.parent.setState({automatic: e.target.checked})}
                                    />
                                    <Bootstrap.Form.Check
                                        inline
                                        type="radio"
                                        label="Manual"
                                        name="updatingRadio"
                                        id="updatingManual"
                                        checked={!this.props.parent.state.automatic}
                                        onChange={(e) => this.props.parent.setState({automatic: !e.target.checked})}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </fieldset>
                        <Bootstrap.Collapse in={this.props.parent.state.automatic}>
                            <div>
                                <Cron parent={this.props.parent}/>
                            </div>
                        </Bootstrap.Collapse>
                        <fieldset>
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column md={2}>
                                    Source type:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        label="SPARQL"
                                        name="typeSparqlCheck"
                                        id="typeSparqlCheck"
                                        checked={this.props.parent.state.sparql}
                                        onChange={(e) => {
                                            if (!e.target.checked && !this.props.parent.state.documents)
                                                this.props.parent.setState({documents: true})
                                            this.props.parent.setState({sparql: e.target.checked})
                                        }}
                                    />
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        label="Document"
                                        name="typeDocumentCheck"
                                        id="typeDocumentCheck"
                                        checked={this.props.parent.state.documents}
                                        onChange={(e) => {
                                            if (!e.target.checked && !this.props.parent.state.sparql)
                                                this.props.parent.setState({sparql: true})
                                            this.props.parent.setState({documents: e.target.checked})
                                        }}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </fieldset>
                        <Bootstrap.Collapse in={this.props.parent.state.sparql}>
                            {this.renderTypeSPARQL()}
                        </Bootstrap.Collapse>
                        <Bootstrap.Collapse in={this.props.parent.state.documents}>
                            {this.renderTypeDocument()}
                        </Bootstrap.Collapse>
                    </Bootstrap.Card.Body>
                </Bootstrap.Card>
                <div className={this.props.parent.state.advanced ? "dropdown" : "dropright"}>
                    <Bootstrap.Dropdown.Toggle className={"mt-3"} variant="secondary"
                                               onClick={() => this.props.parent.setState({advanced: !this.props.parent.state.advanced})}>
                        Advanced
                    </Bootstrap.Dropdown.Toggle>
                </div>
                <Bootstrap.Collapse in={this.props.parent.state.advanced}>
                    <div>
                        <Advanced parent={this.props.parent}/>
                    </div>
                </Bootstrap.Collapse>
            </Bootstrap.Form>
        )
    }


    renderTypeSPARQL() {
        return (
            <Bootstrap.Card className={"ml-5 mt-2 mb-2"}>
                <Bootstrap.Card.Header>SPARQL</Bootstrap.Card.Header>
                <Bootstrap.Card.Body>
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Form.Label column md={2}>
                            SPARQL endpoint:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col md={10}>
                            <Bootstrap.Form.Control placeholder="https://example.org/sparql"
                                                    value={this.props.parent.state.sparqlEndpoint}
                                                    onChange={(e) => {
                                                        e.target.classList.remove('is-invalid');
                                                        this.props.parent.setState({sparqlEndpoint: e.target.value});
                                                    }}/>
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                    <fieldset>
                        <Bootstrap.Form.Group as={Bootstrap.Row}>
                            <Bootstrap.Form.Label as="legend" column md={2}>
                                Query type:
                            </Bootstrap.Form.Label>
                            <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                                <Bootstrap.Form.Check
                                    inline
                                    type="radio"
                                    label="SELECT"
                                    name="queryType"
                                    id="queryTypeSelect"
                                    checked={this.props.parent.state.queryType === "select"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.props.parent.setState({queryType: "select"})
                                    }}
                                />
                                <Bootstrap.Form.Check
                                    inline
                                    type="radio"
                                    label="CONSTRUCT"
                                    name="queryType"
                                    id="queryTypeConstruct"
                                    checked={this.props.parent.state.queryType === "construct"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.props.parent.setState({queryType: "construct"})
                                    }}
                                />
                                <Bootstrap.Form.Check
                                    inline
                                    type="radio"
                                    label="DESCRIBE"
                                    name="queryType"
                                    id="queryTypeDescribe"
                                    checked={this.props.parent.state.queryType === "describe"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.props.parent.setState({queryType: "describe"})
                                    }}
                                />
                            </Bootstrap.Col>
                        </Bootstrap.Form.Group>
                    </fieldset>
                    <Bootstrap.Form.Group as={Bootstrap.Row} controlId="sparqlEndpoint">
                        <Bootstrap.Form.Label column md={2}>
                            Query:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col md={10}>
                            {this.props.parent.state.queries.map((query, index) => (
                                <div key={index} className={"d-flex align-items-center mb-2"}>
                                    <div className={"w-100"}>
                                        <Bootstrap.Form.Control rows={3} as={"textarea"}
                                                                value={query}
                                                                onChange={(e) => {
                                                                    e.target.classList.remove('is-invalid');
                                                                    this.props.parent.setState(prev => {
                                                                        prev.queries[index] = e.target.value;
                                                                        return {queries: prev.queries};
                                                                    })
                                                                }}/>
                                    </div>
                                    <div className={"m-2"}>
                                        <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                         icon={faMinusCircle}
                                                         title={"Remove"}
                                                         onClick={() => this.props.parent.setState((prev) => {
                                                             prev.queries.splice(index, 1);
                                                             return {queries: prev.queries}
                                                         })}/>
                                    </div>
                                </div>
                            ))}
                            <AddRowButton length={this.props.parent.state.queries.length} onClick={() => {
                                this.props.parent.setState(prev => ({queries: prev.queries.concat([""])}));
                            }}/>
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }

    renderTypeDocument() {
        return (
            <Bootstrap.Card className={"ml-5 mt-2 mb-2"}>
                <Bootstrap.Card.Header>Document</Bootstrap.Card.Header>
                <Bootstrap.Card.Body>
                    <Bootstrap.Form.Group as={Bootstrap.Row} controlId="documentEndpoint">
                        <Bootstrap.Form.Label column md={2}>
                            Addresses:
                        </Bootstrap.Form.Label>
                        <SingleInput parent={this.props.parent} data={this.props.parent.state.documentAddresses}
                                     dataName={"documentAddresses"}
                                     placeholder={"https://example.org/dataset.ttl"}/>
                    </Bootstrap.Form.Group>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }
}

export default InteractiveTab;