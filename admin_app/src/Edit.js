import React from "react";
import * as Bootstrap from "react-bootstrap";
import "./Edit.css";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTimes, faTimesCircle, faUndoAlt} from "@fortawesome/free-solid-svg-icons";

const api = axios.create({baseURL: 'http://localhost:8080/api/'});

class AddRowButton extends React.Component {
    render() {
        return (
            <div className={"d-flex align-items-center" + (this.props.length > 0 ? "" : " mt-2")}>
                {this.props.length > 0 ? <div className="w-100 m-0 ml-2 mr-2 border border-success"/> : ""}
                <button type="button" className=" close border border-success rounded-circle plus"
                        aria-label="Close" onClick={this.props.onClick}>
                    <div className="text-success plus-text" aria-hidden="true">&#43;</div>
                </button>
                <div className="w-100 m-0 ml-2 mr-2 border border-success"/>
            </div>
        )
    }
}

class Edit extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>
                            {this.props.match.params.name ? "Editing: " + this.props.match.params.name : "New index"}
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <Tabs addAlert={this.props.addAlert} match={this.props.match} history={this.props.history}
                              name={this.props.match.params.name}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

class Tabs extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            name: "",
            schedule: "0 0 9 * * *".split(" "),
            automatic: true,
            documents: false,
            documentAddresses: [],//array
            sparql: true,
            sparqlEndpoint: "",
            queryType: "select",
            queries: [],//array
            advanced: false,
            includeResourceURI: true,
            addLanguage: true,
            language: "en",
            URIDescription: [],//array of pairs [string,string]
            filtrationListType: "none",
            filtrationList: [],//array
            mappingFiltrationType: "none",
            mappingFiltration: [],//array of pairs [string,array of strings]
            propertiesNormalization: [],//array of pairs [string,array of strings]
            objectNormalization: [],//array of pairs [string,string]
            missingPropertyNormalization: [],//array of pairs [string,array of strings]
            config: {},
            readOnly: true,
            configRaw: "",
            minReqPopup: false,
            minRawReq: false,
            askToConvertRawToVars: false,
        };
        if (this.props.name) api.get('configs/' + this.props.name).then((response) => {
            this.setState({config: response.data}, () =>
                this.setState({configRaw: JSON.stringify(this.state.config, null, 7)}, () => {
                        this.setStateFromConfig();
                    }
                )
            );
        }).catch((error) => {
            this.props.addAlert({
                variant: "danger",
                title: "Get configs request error",
                message: error,
                durationSec: 300
            })
        })

    }

    sendConfig(address, config) {
        api.put(address, config).then(() => this.props.history.push("/")).catch((error) => {
            this.props.addAlert({
                variant: "danger",
                title: "Save config request error",
                message: error,
                durationSec: 300
            })
        });
    }

    createSaveButtons() {
        return (
            <div className={"save-buttons"}>
                <Bootstrap.Button type="submit" variant={"success"}
                                  className={'mr-3'}
                                  name={"save"}
                                  value={"configs"}
                ><FontAwesomeIcon icon={faSave}/> Save</Bootstrap.Button>
                <Bootstrap.Button type="submit" variant={"success"}
                                  className={'mr-3'}
                                  name={"save"}
                                  value={"configAndIndex"}
                ><FontAwesomeIcon icon={faSave}/> Save and index</Bootstrap.Button>
            </div>
        )
    }

    convertVarsToConfig() {
        let eeaRDF = {}
        if (this.state.documents) Object.assign(eeaRDF, {
            uris: this.state.documentAddresses
        })
        if (this.state.sparql) Object.assign(eeaRDF, {
            endpoint: this.state.sparqlEndpoint,
            query: this.state.queries,
            queryType: this.state.queryType
        })
        if (!this.state.includeResourceURI) Object.assign(eeaRDF, {
            includeResourceURI: this.state.includeResourceURI
        })
        if (!this.state.addLanguage) Object.assign(eeaRDF, {
            addLanguage: this.state.addLanguage
        })
        if (this.state.language !== "en") Object.assign(eeaRDF, {
            language: this.state.language
        })
        if (this.state.URIDescription !== undefined && this.state.URIDescription.length > 0) Object.assign(eeaRDF, {
            uriDescription: this.state.URIDescription
        })
        if (this.state.filtrationListType !== "none" && this.state.filtrationList !== undefined && this.state.filtrationList.length > 0) Object.assign(eeaRDF, {
            proplist: this.state.filtrationList,
            listtype: this.state.filtrationListType
        })
        if (this.state.mappingFiltrationType !== "none" && this.state.mappingFiltration !== undefined && this.state.mappingFiltration.length > 0) {
            let map = new Map();
            this.state.mappingFiltration.forEach(pair => map[pair[0]] = pair[1]);
            Object.assign(eeaRDF, {[this.state.mappingFiltrationType]: map});
        }
        if (this.state.propertiesNormalization !== undefined && this.state.propertiesNormalization.length > 0) {
            let map = new Map();
            this.state.propertiesNormalization.forEach(pair => map[pair[0]] = pair[1]);
            Object.assign(eeaRDF, {normProp: map});
        }
        if (this.state.objectNormalization !== undefined && this.state.objectNormalization.length > 0) {
            let map = new Map();
            this.state.objectNormalization.forEach(pair => map[pair[0]] = pair[1]);
            Object.assign(eeaRDF, {normObj: map});
        }
        if (this.state.missingPropertyNormalization !== undefined && this.state.missingPropertyNormalization.length > 0) {
            let map = new Map();
            this.state.missingPropertyNormalization.forEach(pair => map[pair[0]] = pair[1]);
            Object.assign(eeaRDF, {normMissing: map});
        }

        let config = {
            schedule: {
                schedule: this.state.schedule.join(" "),
                automatic: this.state.automatic
            },
            config: {
                type: "eeaRDF",
                eeaRDF: eeaRDF,
                syncReq: {},
                index: {
                    index: this.state.name,
                    type: "rdf"
                }
            }
        }

        this.setState({
            config: config
        })
        this.setState({configRaw: JSON.stringify(config, null, 7)});
        return config;
    }

    resetStates(performAfter) {
        this.setState({
            automatic: true,
            documents: false,
            documentAddresses: [],//array
            sparql: true,
            sparqlEndpoint: "",
            queryType: "select",
            queries: [],//array
            advanced: false,
            includeResourceURI: true,
            addLanguage: true,
            language: "en",
            URIDescription: [],//array of pairs [string,string]
            filtrationListType: "none",
            filtrationList: [],//array
            mappingFiltrationType: "none",
            mappingFiltration: [],//array of pairs [string,array of strings]
            propertiesNormalization: [],//array of pairs [string,array of strings]
            objectNormalization: [],//array of pairs [string,string]
            missingPropertyNormalization: []//array of pairs [string,array of strings]
        }, performAfter);
    }

    setStateFromConfig() {
        this.resetStates(() => {
            if (this.state.config === {} || this.state.config === undefined) return;
            if (this.state.config.schedule) {
                if (this.state.config.schedule.schedule) this.setState({schedule: this.state.config.schedule.schedule.split(" ")});
                if (this.state.config.schedule.automatic !== undefined) this.setState({automatic: this.state.config.schedule.automatic});
            }
            if (this.state.config.config) {
                if (this.state.config.config.eeaRDF) {
                    let eeaRDF = this.state.config.config.eeaRDF;
                    if (eeaRDF.includeResourceURI !== undefined || eeaRDF.addLanguage !== undefined || eeaRDF.language || eeaRDF.uriDescription || eeaRDF.proplist || eeaRDF.listtype || eeaRDF.whiteMap || eeaRDF.blackMap || eeaRDF.normProp || eeaRDF.normObj || eeaRDF.normMissing)
                        this.setState({advanced: true});
                    if (eeaRDF.uris) {
                        this.setState({documentAddresses: eeaRDF.uris});
                        this.setState({documents: true});
                    }
                    if (eeaRDF.endpoint) this.setState({sparqlEndpoint: eeaRDF.endpoint});
                    if (eeaRDF.query) {
                        this.setState({queries: eeaRDF.query});
                        this.setState({sparql: true});
                    } else this.setState({sparql: false});
                    if (eeaRDF.queryType) this.setState({queryType: eeaRDF.queryType});
                    if (eeaRDF.includeResourceURI !== undefined) this.setState({includeResourceURI: eeaRDF.includeResourceURI});
                    if (eeaRDF.addLanguage !== undefined) this.setState({addLanguage: eeaRDF.addLanguage});
                    if (eeaRDF.language) this.setState({language: eeaRDF.language});
                    if (eeaRDF.uriDescription) this.setState({URIDescription: eeaRDF.uriDescription});
                    if (eeaRDF.proplist) this.setState({filtrationList: eeaRDF.proplist});
                    if (eeaRDF.listtype) this.setState({filtrationListType: eeaRDF.listtype});
                    if (eeaRDF.whiteMap) {
                        this.setState({mappingFiltrationType: "whiteMap"})
                        this.setState({mappingFiltration: Object.entries(eeaRDF.whiteMap)})
                    } else if (eeaRDF.blackMap) {
                        this.setState({mappingFiltrationType: "blackMap"})
                        this.setState({mappingFiltration: Object.entries(eeaRDF.blackMap)})
                    }
                    if (eeaRDF.normProp) this.setState({propertiesNormalization: Object.entries(eeaRDF.normProp)});
                    if (eeaRDF.normObj) this.setState({objectNormalization: Object.entries(eeaRDF.normObj)});
                    if (eeaRDF.normMissing) this.setState({missingPropertyNormalization: Object.entries(eeaRDF.normMissing)});

                }
                if (this.state.config.config.index) {
                    if (this.state.config.config.index.index) this.setState({name: this.state.config.config.index.index});
                }
            }
        });
    }

    showPopupForConvertConfigRawToVars() {
        if (this.state.readOnly) return;
        this.setState({askToConvertRawToVars: true})
    }

    convertConfigRawToVars() {
        this.setState({askToConvertRawToVars: false})
        let config;
        try {
            config = JSON.parse(this.state.configRaw);
        } catch (e) {
            this.props.addAlert({
                variant: "danger",
                title: "Raw config error",
                message: "Could not parse as JSON. Check brackets and JSON notation.",
                durationSec: 30
            })
            return;
        }
        this.setState({readOnly: true});
        this.setState({config: config}, () =>
            this.setStateFromConfig()
        )
    }

    render() {
        return (<>
                {this.createSaveButtons()}
                <Bootstrap.Tabs defaultActiveKey="interactive" onSelect={(name) => {
                    if (name === "raw") this.convertVarsToConfig(); else this.showPopupForConvertConfigRawToVars();
                }}>
                    <Bootstrap.Tab eventKey="interactive" title="Interactive" disabled={!this.state.readOnly}>
                        <Bootstrap.Card className={"border-top-0"}>
                            <Bootstrap.Card.Body>
                                {this.renderInteractive()}
                            </Bootstrap.Card.Body>
                        </Bootstrap.Card>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="raw" title="RAW">
                        <Bootstrap.Card className={"border-top-0"}>
                            <Bootstrap.Card.Body>
                                {this.renderRawTab()}
                            </Bootstrap.Card.Body>
                        </Bootstrap.Card>
                    </Bootstrap.Tab>
                </Bootstrap.Tabs>
            </>
        )
    }

    renderRawTab() {
        return (
            <Bootstrap.Form method={"post"} onSubmit={(e) => this.checkValidity(e)}>
                {this.createSaveButtons()}
                <Bootstrap.Row>
                    <Bootstrap.Col className={"d-flex align-items-center"}>
                        <Bootstrap.Form.Check className={"m-2"} type="checkbox" label="Read only"
                                              checked={this.state.readOnly}
                                              onChange={(event) => {
                                                  if (event.target.checked) this.showPopupForConvertConfigRawToVars();
                                                  else this.setState({readOnly: false});
                                              }}/>
                    </Bootstrap.Col>
                    <Bootstrap.Col className={"d-flex justify-content-end"}>
                        <Bootstrap.Button className={"m-2"} disabled={this.state.readOnly} variant={"warning"}
                                          onClick={() => this.setState({configRaw: JSON.stringify(this.state.config, null, 7)})}>
                            Revert changes <FontAwesomeIcon icon={faUndoAlt}/></Bootstrap.Button>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Form.Control rows={25} as={"textarea"} readOnly={this.state.readOnly}
                                        value={this.state.configRaw}
                                        onChange={(e) => this.setState({configRaw: e.target.value})}
                />
            </Bootstrap.Form>
        )
    }

    checkEmpty(e) {
        let emptyInputs = e.target.querySelectorAll('input[value=""],textarea:empty');
        for (let i = 0; i < emptyInputs.length; ++i) {
            emptyInputs[i].classList.add("is-invalid");
        }
        let hiddenInputs = e.target.querySelectorAll('.collapse:not(.show,.exclude) input.is-invalid,.collapse:not(.show,.exclude) textarea.is-invalid')
        for (let i = 0; i < hiddenInputs.length; ++i) {
            hiddenInputs[i].classList.remove("is-invalid");
        }
    }

    minRequirements() {
        return !((this.state.sparql && this.state.queries.length < 1) || (this.state.documents && this.state.documentAddresses.length < 1));
    }

    checkValidity(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.readOnly) {
            let config;
            try {
                config = JSON.parse(this.state.configRaw);
            } catch (e) {
                this.props.addAlert({
                    variant: "danger",
                    title: "Raw config error",
                    message: "Could not parse as JSON. Check brackets and JSON notation.",
                    durationSec: 30
                })
                return;
            }
            if (config.config === undefined || config.config.index === undefined || config.config.index.index === undefined || config.config.index.index.split("").length < 1) {
                this.setState({minRawReq: true});
                return;
            }
            this.sendConfig(e.nativeEvent.submitter.value, config);
            return;
        }
        this.checkEmpty(e);
        if (!this.minRequirements()) {
            this.setState({minReqPopup: true});
            return;
        }
        let firstProblemInput = e.target.querySelector('.is-invalid');
        if (firstProblemInput === null) {
            this.sendConfig(e.nativeEvent.submitter.value, this.convertVarsToConfig());
        } else {
            firstProblemInput.focus();
        }

    }

    createPopups() {
        return (<>
            <Bootstrap.Modal
                show={this.state.minReqPopup}
                size="sm"
                centered
            >
                <Bootstrap.Modal.Header className={"bg-danger bg-danger text-light"}>
                    <FontAwesomeIcon
                        className="pointer position-absolute right-0 top-0 m-2"
                        icon={faTimes}
                        title={"Close"}
                        onClick={() => this.setState({minReqPopup: false})}/>
                    <Bootstrap.Modal.Title>
                        Minimum Requirements
                    </Bootstrap.Modal.Title>

                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    {this.state.sparql && this.state.queries.length < 1 ? <><h5>Source type: SPARQL</h5>
                        <p>
                            At least one SPARQL query is required!
                        </p></> : ""}
                    {this.state.documents && this.state.documentAddresses.length < 1 ? <><h5>Source type:
                        Document</h5>
                        <p>
                            At least one Document URI is required!
                        </p></> : ""}
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
            <Bootstrap.Modal
                show={this.state.minRawReq}
                centered
            >
                <Bootstrap.Modal.Header className={"bg-danger bg-danger text-light"}>
                    <FontAwesomeIcon
                        className="pointer position-absolute right-0 top-0 m-2"
                        icon={faTimes}
                        title={"Close"}
                        onClick={() => this.setState({minRawReq: false})}/>
                    <Bootstrap.Modal.Title>
                        Name required
                    </Bootstrap.Modal.Title>

                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    <p>
                        Index name is required. Name can't start with '@temp-' and can't contain
                        '{'\\, /, ?, ", <, >, |'}'.
                    </p>
                    <pre>Example:{' \n'}

                        {JSON.stringify({"config": {"index": {"index": "name-here", "type": "rdf"}}}, null, 4)}
                    </pre>
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
            <Bootstrap.Modal show={this.state.askToConvertRawToVars} animation={true}>
                <Bootstrap.Modal.Header closeButton>
                    <Bootstrap.Modal.Title>Convert to interactive</Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    <p className={"text-danger"}>When converting to interactive mode, unknown attributes will be
                        lost.</p>
                    <p>Are you sure you want to convert to interactive mode?</p>
                </Bootstrap.Modal.Body>
                <Bootstrap.Modal.Footer>
                    <Bootstrap.Button variant="secondary" onClick={() => this.convertConfigRawToVars()}>
                        Yes
                    </Bootstrap.Button>
                    <Bootstrap.Button variant="secondary" onClick={() => this.setState({askToConvertRawToVars: false})}>
                        No
                    </Bootstrap.Button>
                </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>
        </>)
    }

    renderInteractive() {
        return (
            <Bootstrap.Form method={"post"} onSubmit={(e) => this.checkValidity(e)}>
                {this.createSaveButtons()}
                {this.createPopups()}
                <Bootstrap.Card>
                    <Bootstrap.Card.Header>Endpoint:</Bootstrap.Card.Header>
                    <Bootstrap.Card.Body>
                        <Bootstrap.Form.Group as={Bootstrap.Row}>
                            <Bootstrap.Form.Label column md={2}>
                                Index name:
                            </Bootstrap.Form.Label>
                            <Bootstrap.Col md={10}>
                                <Bootstrap.Form.Control placeholder="index-name" value={this.state.name}
                                                        readOnly={this.props.match.params.name}
                                                        onChange={(e) => {
                                                            e.target.classList.remove('is-invalid');
                                                            if (e.target.value.startsWith("@temp-") || e.target.value.toLowerCase().split("").some(char => "\\/?\"<>|".indexOf(char) !== -1))
                                                                e.target.classList.add('is-invalid');
                                                            this.setState({name: e.target.value.toLowerCase()});
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
                                        checked={this.state.automatic}
                                        onChange={(e) => this.setState({automatic: e.target.checked})}
                                    />
                                    <Bootstrap.Form.Check
                                        inline
                                        type="radio"
                                        label="Manual"
                                        name="updatingRadio"
                                        id="updatingManual"
                                        checked={!this.state.automatic}
                                        onChange={(e) => this.setState({automatic: !e.target.checked})}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </fieldset>
                        <Bootstrap.Collapse in={this.state.automatic}>
                            {this.renderCron()}
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
                                        checked={this.state.sparql}
                                        onChange={(e) => {
                                            if (!e.target.checked && !this.state.documents)
                                                this.setState({documents: true})
                                            this.setState({sparql: e.target.checked})
                                        }}
                                    />
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        label="Document"
                                        name="typeDocumentCheck"
                                        id="typeDocumentCheck"
                                        checked={this.state.documents}
                                        onChange={(e) => {
                                            if (!e.target.checked && !this.state.sparql)
                                                this.setState({sparql: true})
                                            this.setState({documents: e.target.checked})
                                        }}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </fieldset>
                        <Bootstrap.Collapse in={this.state.sparql}>
                            {this.renderTypeSPARQL()}
                        </Bootstrap.Collapse>
                        <Bootstrap.Collapse in={this.state.documents}>
                            {this.renderTypeDocument()}
                        </Bootstrap.Collapse>
                    </Bootstrap.Card.Body>
                </Bootstrap.Card>
                <div className={this.state.advanced ? "dropdown" : "dropright"}>
                    <Bootstrap.Dropdown.Toggle className={"mt-3"} variant="secondary"
                                               onClick={() => this.setState({advanced: !this.state.advanced})}>
                        Advanced
                    </Bootstrap.Dropdown.Toggle>
                </div>
                <Bootstrap.Collapse in={this.state.advanced}>
                    {this.renderAdvanced()}
                </Bootstrap.Collapse>
            </Bootstrap.Form>
        )
    }

    renderAdvanced() {
        return (
            <Bootstrap.Card className={"exclude"}>
                <Bootstrap.Card.Body>
                    <Bootstrap.ListGroup variant="flush">
                        <Bootstrap.ListGroup.Item className="pb-0">
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column md={2}>
                                    Include resource URI:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        name="includeResourceURI"
                                        id="includeResourceURI"
                                        checked={this.state.includeResourceURI}
                                        onChange={(e) => this.setState({includeResourceURI: e.target.checked})}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column md={2}>
                                    Add languages:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        name="addLanguages"
                                        id="addLanguages"
                                        checked={this.state.addLanguage}
                                        onChange={(e) => this.setState({addLanguage: e.target.checked})}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column md={2}>
                                    Default language:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} md={2} lg={1}>
                                    <Bootstrap.Form.Control
                                        value={this.state.language}
                                        onChange={(e) => this.setState({language: e.target.value})}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Form.Group>
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderUriDescription()}
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderFiltrationList()}
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderMappingFiltration()}
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderPropertiesNormalization()}
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderObjectNormalization()}
                        </Bootstrap.ListGroup.Item>
                        <Bootstrap.ListGroup.Item className="pb-0">
                            {this.renderMissingPropertyNormalization()}
                        </Bootstrap.ListGroup.Item>
                    </Bootstrap.ListGroup>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }

    renderObjectNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label column md={2}>
                    Object normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col md={10}>
                    {this.state.objectNormalization.map((pair, index) => {
                        return (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"w-100"}>
                                    <Bootstrap.Row key={index}>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control className={"mb-2"}
                                                                    placeholder={"Quick Event"}
                                                                    value={pair[0]}
                                                                    onChange={(e) => {
                                                                        e.target.classList.remove('is-invalid');
                                                                        this.setState(prev => {
                                                                            prev.objectNormalization[index][0] = e.target.value;
                                                                            return {objectNormalization: prev.objectNormalization};
                                                                        })
                                                                    }}/>
                                        </Bootstrap.Col>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control className={"mb-2"}
                                                                    placeholder={"Event"}
                                                                    value={pair[1]}
                                                                    onChange={(e) => {
                                                                        e.target.classList.remove('is-invalid');
                                                                        this.setState(prev => {
                                                                            prev.objectNormalization[index][1] = e.target.value;
                                                                            return {objectNormalization: prev.objectNormalization};
                                                                        })
                                                                    }}/>
                                        </Bootstrap.Col>
                                    </Bootstrap.Row>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"} icon={faTimesCircle}
                                                     title={"Remove"} onClick={() => this.setState((prev) => {
                                        prev.objectNormalization.splice(index, 1);
                                        return {objectNormalization: prev.objectNormalization}
                                    })}/>
                                </div>
                            </div>
                        )
                    })}
                    <AddRowButton length={this.state.objectNormalization.length}
                                  onClick={() => this.setState(prev => ({objectNormalization: prev.objectNormalization.concat([["", ""]])}))}/>
                </Bootstrap.Col>
            </Bootstrap.Form.Group>
        )
    }

    renderFiltrationList() {
        return (<>
            <fieldset>
                <Bootstrap.Form.Group as={Bootstrap.Row}>
                    <Bootstrap.Form.Label as="legend" column md={2}>
                        Filtration list:
                    </Bootstrap.Form.Label>
                    <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                        <Bootstrap.Form.Check
                            inline
                            type="radio"
                            label="None"
                            name="filtrationListType"
                            checked={this.state.filtrationListType === "none"}
                            onChange={(e) => {
                                if (e.target.checked) this.setState({filtrationListType: "none"})
                            }}
                        />
                        <Bootstrap.Form.Check
                            inline
                            type="radio"
                            label="Whitelist"
                            name="filtrationListType"
                            checked={this.state.filtrationListType === "white"}
                            onChange={(e) => {
                                if (e.target.checked) this.setState({filtrationListType: "white"})
                            }}
                        />
                        <Bootstrap.Form.Check
                            inline
                            type="radio"
                            label="Blacklist"
                            name="filtrationListType"
                            checked={this.state.filtrationListType === "black"}
                            onChange={(e) => {
                                if (e.target.checked) this.setState({filtrationListType: "black"})
                            }}
                        />
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
            </fieldset>
            <Bootstrap.Collapse in={this.state.filtrationListType !== "none"}>
                <Bootstrap.Form.Group as={Bootstrap.Row}>
                    <Bootstrap.Col md={2}>
                    </Bootstrap.Col>
                    <Bootstrap.Col md={10}>
                        {this.state.filtrationList.map((address, index) => (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"w-100"}>
                                    <Bootstrap.Form.Control
                                        placeholder={"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}
                                        value={address}
                                        onChange={(e) => {
                                            e.target.classList.remove('is-invalid');
                                            this.setState(prev => {
                                                prev.filtrationList[index] = e.target.value;
                                                return {filtrationList: prev.filtrationList};
                                            })
                                        }}/>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"} icon={faTimesCircle}
                                                     title={"Remove"} onClick={() => this.setState((prev) => {
                                        prev.filtrationList.splice(index, 1);
                                        return {filtrationList: prev.filtrationList}
                                    })}/>
                                </div>
                            </div>
                        ))}
                        <AddRowButton length={this.state.filtrationList.length} onClick={() => {
                            this.setState(prev => ({filtrationList: prev.filtrationList.concat([""])}));
                        }}/>
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
            </Bootstrap.Collapse>
        </>)
    }

    renderUriDescription() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label column md={2}>
                    URI description:
                </Bootstrap.Form.Label>
                <Bootstrap.Col md={10}>
                    {this.state.URIDescription.map((pair, index) => {
                        return (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"w-100"}>
                                    <Bootstrap.Row>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control
                                                placeholder={"http://www.w3.org/2000/01/rdf-schema#label"}
                                                value={pair[0]}
                                                onChange={(e) => {
                                                    e.target.classList.remove('is-invalid');
                                                    this.setState(prev => {
                                                        prev.URIDescription[index][0] = e.target.value;
                                                        return {URIDescription: prev.URIDescription};
                                                    })
                                                }}/>
                                        </Bootstrap.Col>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control
                                                placeholder={"http://purl.org/dc/terms/title"}
                                                value={pair[1]}
                                                onChange={(e) => {
                                                    e.target.classList.remove('is-invalid');
                                                    this.setState(prev => {
                                                        prev.URIDescription[index][1] = e.target.value;
                                                        return {URIDescription: prev.URIDescription};
                                                    })
                                                }}/>
                                        </Bootstrap.Col>
                                    </Bootstrap.Row>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"} icon={faTimesCircle}
                                                     title={"Remove"} onClick={() => this.setState((prev) => {
                                        prev.URIDescription.splice(index, 1);
                                        return {URIDescription: prev.URIDescription}
                                    })}/>
                                </div>
                            </div>
                        )
                    })}
                    <AddRowButton length={this.state.URIDescription.length}
                                  onClick={() => this.setState(prev => ({URIDescription: prev.URIDescription.concat([["", ""]])}))}/>
                </Bootstrap.Col>
            </Bootstrap.Form.Group>
        )
    }

    renderMissingPropertyNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label as="legend" column md={2}>
                    Missing property normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col md={10}>
                    {this.state.missingPropertyNormalization.map((pair, index) => {
                        return (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"d-flex w-100"}>
                                    <Bootstrap.Col sm={6}>
                                        <Bootstrap.Form.Control className={"mb-2"}
                                                                placeholder={"http://purl.org/dc/elements/1.1/spatial"}
                                                                value={pair[0]}
                                                                onChange={(e) => {
                                                                    e.target.classList.remove('is-invalid');
                                                                    this.setState(prev => {
                                                                        prev.missingPropertyNormalization[index][0] = e.target.value;
                                                                        return {missingPropertyNormalization: prev.missingPropertyNormalization};
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
                                                            onClick={() => this.setState((prev) => {
                                                                prev.missingPropertyNormalization[index][1].splice(innerIndex, 1);
                                                                return {missingPropertyNormalization: prev.missingPropertyNormalization}
                                                            })}/> : ""}
                                                        <Bootstrap.Form.Control className={"mb-2"}
                                                                                placeholder={"Other"}
                                                                                value={trackedFile}
                                                                                onChange={(e) => {
                                                                                    e.target.classList.remove('is-invalid');
                                                                                    this.setState(prev => {
                                                                                        prev.missingPropertyNormalization[index][1][innerIndex] = e.target.value;
                                                                                        return {missingPropertyNormalization: prev.missingPropertyNormalization};
                                                                                    })
                                                                                }}/>
                                                    </Bootstrap.Col>
                                                </div>
                                            )
                                        })}
                                        <Bootstrap.Button className={"mb-2"} variant={"outline-success"}
                                                          onClick={() => {
                                                              this.setState(prev => {
                                                                  prev.missingPropertyNormalization[index][1] = prev.missingPropertyNormalization[index][1].concat([""]);
                                                                  return {missingPropertyNormalization: prev.missingPropertyNormalization};
                                                              });
                                                          }}>Add value</Bootstrap.Button>
                                    </Bootstrap.Col>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                     icon={faTimesCircle}
                                                     title={"Remove"}
                                                     onClick={() => this.setState((prev) => {
                                                         prev.missingPropertyNormalization.splice(index, 1);
                                                         return {missingPropertyNormalization: prev.missingPropertyNormalization}
                                                     })}/>
                                </div>
                            </div>
                        )
                    })}

                    <AddRowButton length={this.state.missingPropertyNormalization.length} onClick={() => {
                        this.setState(prev => ({missingPropertyNormalization: prev.missingPropertyNormalization.concat([["", [""]]])}));
                    }}/>
                </Bootstrap.Col>
            </Bootstrap.Form.Group>
        )
    }

    renderPropertiesNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label as="legend" column md={2}>
                    Properties normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col md={10}>
                    {this.state.propertiesNormalization.map((pair, index) => {
                        return (
                            <div key={index} className={"d-flex align-items-center mb-2"}>
                                <div className={"d-flex w-100"}>
                                    <Bootstrap.Col sm={6}>
                                        <Bootstrap.Form.Control
                                            placeholder={"http://purl.org/dc/elements/1.1/format"}
                                            value={pair[0]}
                                            onChange={(e) => {
                                                e.target.classList.remove('is-invalid');
                                                this.setState(prev => {
                                                    prev.propertiesNormalization[index][0] = e.target.value;
                                                    return {propertiesNormalization: prev.propertiesNormalization};
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
                                                            onClick={() => this.setState((prev) => {
                                                                prev.propertiesNormalization[index][1].splice(innerIndex, 1);
                                                                return {propertiesNormalization: prev.propertiesNormalization}
                                                            })}/> : ""}
                                                        <Bootstrap.Form.Control className={"mb-2"}
                                                                                placeholder={"format"}
                                                                                value={trackedFile}
                                                                                onChange={(e) => {
                                                                                    e.target.classList.remove('is-invalid');
                                                                                    this.setState(prev => {
                                                                                        prev.propertiesNormalization[index][1][innerIndex] = e.target.value;
                                                                                        return {propertiesNormalization: prev.propertiesNormalization};
                                                                                    })
                                                                                }}/>
                                                    </Bootstrap.Col>
                                                </div>
                                            )
                                        })}
                                        <Bootstrap.Button variant={"outline-success"}
                                                          onClick={() => {
                                                              this.setState(prev => {
                                                                  prev.propertiesNormalization[index][1] = prev.propertiesNormalization[index][1].concat([""]);
                                                                  return {propertiesNormalization: prev.propertiesNormalization};
                                                              });
                                                          }}>Add copy</Bootstrap.Button>
                                    </Bootstrap.Col>
                                </div>
                                <div className={"m-2"}>
                                    <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                     icon={faTimesCircle}
                                                     title={"Remove"}
                                                     onClick={() => this.setState((prev) => {
                                                         prev.propertiesNormalization.splice(index, 1);
                                                         return {propertiesNormalization: prev.propertiesNormalization}
                                                     })}/>
                                </div>
                            </div>
                        )
                    })}
                    <AddRowButton length={this.state.propertiesNormalization.length} onClick={() => {
                        this.setState(prev => ({propertiesNormalization: prev.propertiesNormalization.concat([["", [""]]])}));
                    }}/>
                </Bootstrap.Col>
            </Bootstrap.Form.Group>
        )
    }

    renderMappingFiltration() {
        return (<>
                <fieldset>
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Form.Label as="legend" column md={2}>
                            Mapping filtration:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col className={"align-items-center d-flex"} md={10}>
                            <Bootstrap.Form.Check
                                inline
                                type="radio"
                                label="None"
                                name="mappingFiltrationType"
                                checked={this.state.mappingFiltrationType === "none"}
                                onChange={(e) => {
                                    if (e.target.checked) this.setState({mappingFiltrationType: "none"})
                                }}
                            />
                            <Bootstrap.Form.Check
                                inline
                                type="radio"
                                label="WhiteMap"
                                name="mappingFiltrationType"
                                checked={this.state.mappingFiltrationType === "whiteMap"}
                                onChange={(e) => {
                                    if (e.target.checked) this.setState({mappingFiltrationType: "whiteMap"})
                                }}
                            />
                            <Bootstrap.Form.Check
                                inline
                                type="radio"
                                label="BlackMap"
                                name="mappingFiltrationType"
                                checked={this.state.mappingFiltrationType === "blackMap"}
                                onChange={(e) => {
                                    if (e.target.checked) this.setState({mappingFiltrationType: "blackMap"})
                                }}
                            />
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                </fieldset>
                <Bootstrap.Collapse in={this.state.mappingFiltrationType !== "none"}>
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Col md={2}>
                        </Bootstrap.Col>
                        <Bootstrap.Col md={10}>
                            {this.state.mappingFiltration.map((pair, index) => {
                                return (
                                    <div key={index} className={"d-flex align-items-center mb-2"}>
                                        <div className={"d-flex w-100"}>
                                            <Bootstrap.Col sm={6}>
                                                <Bootstrap.Form.Control
                                                    placeholder={"http://www.w3.org/1999/02/22-rdf-syntax-ns#typ"}
                                                    value={pair[0]}
                                                    onChange={(e) => {
                                                        e.target.classList.remove('is-invalid');
                                                        this.setState(prev => {
                                                            prev.mappingFiltration[index][0] = e.target.value;
                                                            return {mappingFiltration: prev.mappingFiltration};
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
                                                                    onClick={() => this.setState((prev) => {
                                                                        prev.mappingFiltration[index][1].splice(innerIndex, 1);
                                                                        return {mappingFiltration: prev.mappingFiltration}
                                                                    })}/> : ""}
                                                                <Bootstrap.Form.Control className={"mb-2"}
                                                                                        placeholder={"Tracked File"}
                                                                                        value={trackedFile}
                                                                                        onChange={(e) => {
                                                                                            e.target.classList.remove('is-invalid');
                                                                                            this.setState(prev => {
                                                                                                prev.mappingFiltration[index][1][innerIndex] = e.target.value;
                                                                                                return {mappingFiltration: prev.mappingFiltration};
                                                                                            })
                                                                                        }}/>
                                                            </Bootstrap.Col>
                                                        </div>
                                                    )
                                                })}
                                                <Bootstrap.Button variant={"outline-success"}
                                                                  onClick={() => {
                                                                      this.setState(prev => {
                                                                          prev.mappingFiltration[index][1] = prev.mappingFiltration[index][1].concat([""]);
                                                                          return {mappingFiltration: prev.mappingFiltration};
                                                                      });
                                                                  }}>Add object</Bootstrap.Button>
                                            </Bootstrap.Col>
                                        </div>
                                        <div className={"m-2"}>
                                            <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                             icon={faTimesCircle}
                                                             title={"Remove"}
                                                             onClick={() => this.setState((prev) => {
                                                                 prev.mappingFiltration.splice(index, 1);
                                                                 return {mappingFiltration: prev.mappingFiltration}
                                                             })}/>
                                        </div>
                                    </div>
                                )
                            })}
                            <AddRowButton length={this.state.mappingFiltration.length} onClick={() => {
                                this.setState(prev => ({mappingFiltration: prev.mappingFiltration.concat([["", [""]]])}));
                            }}/>
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                </Bootstrap.Collapse>
            </>
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
                                                    value={this.state.sparqlEndpoint}
                                                    onChange={(e) => {
                                                        e.target.classList.remove('is-invalid');
                                                        this.setState({sparqlEndpoint: e.target.value});
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
                                    checked={this.state.queryType === "select"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.setState({queryType: "select"})
                                    }}
                                />
                                <Bootstrap.Form.Check
                                    inline
                                    type="radio"
                                    label="CONSTRUCT"
                                    name="queryType"
                                    id="queryTypeConstruct"
                                    checked={this.state.queryType === "construct"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.setState({queryType: "construct"})
                                    }}
                                />
                                <Bootstrap.Form.Check
                                    inline
                                    type="radio"
                                    label="DESCRIBE"
                                    name="queryType"
                                    id="queryTypeDescribe"
                                    checked={this.state.queryType === "describe"}
                                    onChange={(e) => {
                                        if (e.target.checked) this.setState({queryType: "describe"})
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
                            {this.state.queries.map((query, index) => (
                                <div key={index} className={"d-flex align-items-center mb-2"}>
                                    <div className={"w-100"}>
                                        <Bootstrap.Form.Control rows={3} as={"textarea"}
                                                                value={query}
                                                                onChange={(e) => {
                                                                    e.target.classList.remove('is-invalid');
                                                                    this.setState(prev => {
                                                                        prev.queries[index] = e.target.value;
                                                                        return {queries: prev.queries};
                                                                    })
                                                                }}/>
                                    </div>
                                    <div className={"m-2"}>
                                        <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                         icon={faTimesCircle}
                                                         title={"Remove"}
                                                         onClick={() => this.setState((prev) => {
                                                             prev.queries.splice(index, 1);
                                                             return {queries: prev.queries}
                                                         })}/>
                                    </div>
                                </div>
                            ))}
                            <AddRowButton length={this.state.queries.length} onClick={() => {
                                this.setState(prev => ({queries: prev.queries.concat([""])}));
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
                        <Bootstrap.Col md={10}>
                            {this.state.documentAddresses.map((address, index) => (
                                <div key={index} className={"d-flex align-items-center mb-2"}>
                                    <div className={"w-100"}>
                                        <Bootstrap.Form.Control
                                            placeholder={"https://example.org/dataset.ttl"}
                                            value={address}
                                            onChange={(e) => {
                                                e.target.classList.remove('is-invalid');
                                                this.setState(prev => {
                                                    prev.documentAddresses[index] = e.target.value;
                                                    return {documentAddresses: prev.documentAddresses};
                                                })
                                            }}/>
                                    </div>
                                    <div className={"m-2"}>
                                        <FontAwesomeIcon className="text-danger pointer" size={"lg"}
                                                         icon={faTimesCircle}
                                                         title={"Remove"}
                                                         onClick={() => this.setState((prev) => {
                                                             prev.documentAddresses.splice(index, 1);
                                                             return {documentAddresses: prev.documentAddresses}
                                                         })}/>
                                    </div>
                                </div>
                            ))}


                            <AddRowButton length={this.state.documentAddresses.length} onClick={() => {
                                this.setState(prev => ({documentAddresses: prev.documentAddresses.concat([""])}));
                            }}/>
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }

    renderCron() {
        let schedule = this.state.schedule;
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
                                    this.setState({schedule: schedule});
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
                                    this.setState({schedule: schedule});
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
                                    this.setState({schedule: schedule});
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
                                    this.setState({schedule: schedule});
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
                                    this.setState({schedule: schedule});
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
                                    this.setState({schedule: schedule});
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

export default withRouter(Edit);