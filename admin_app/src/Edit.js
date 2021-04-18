import React from "react";
import * as Bootstrap from "react-bootstrap";
import "./Edit.css";
import {Link, withRouter} from "react-router-dom";
import axios from "axios";

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
            </div>)
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
                        <Tabs match={this.props.match} name={this.props.match.params.name}/>
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
            configRaw: ""
        };
        if (this.props.name) axios.get('http://localhost:8080/api/config/' + this.props.name).then((response) => {
            this.setState({config: response.data}, () =>
                this.setState({configRaw: JSON.stringify(this.state.config, null, 7)}, () => {
                        this.setStateFromConfig();
                    }
                )
            );
        })

    }

    sendConfig = () => {
        let config = this.convertVarsToConfig();
        axios.put('http://localhost:8080/api/config', config);
    }
    sendConfigAndIndex = () => {
        let config = this.convertVarsToConfig();
        axios.put('http://localhost:8080/api/configAndIndex', config);
    }

    createSaveButtons() {
        return (
            <>
                <Link to={"/"}>
                    <Bootstrap.Button variant={"success"}
                                      className={'mr-3'}
                                      onClick={() => this.sendConfig()}
                    >Save</Bootstrap.Button>
                </Link>
                <Link to={"/"}>
                    <Bootstrap.Button variant={"success"}
                                      className={'mr-3'}
                                      onClick={() => this.sendConfigAndIndex()}
                    >Save and index</Bootstrap.Button>
                </Link>
            </>
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
            uriDescription: this.state.URIDescription//TODO: test
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

    convertConfigRawToVars() {
        if (this.state.readOnly) return;
        let config = JSON.parse(this.state.configRaw);
        this.setState({readOnly: true});
        this.setState({config: config}, () =>
            this.setStateFromConfig()
        )
    }

    render() {
        return (<>
                {/*TODO: to navbar*/}
                {this.createSaveButtons()}
                <Bootstrap.Tabs defaultActiveKey="interactive" onSelect={(e) => {
                    if (e === "raw") this.convertVarsToConfig(); else this.convertConfigRawToVars();
                }}>
                    <Bootstrap.Tab eventKey="interactive" title="Interactive">
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
            <Bootstrap.Form>
                <Bootstrap.Form.Check type="checkbox" label="Read only" checked={this.state.readOnly}
                                      onChange={(event) => {
                                          if (event.target.checked) this.convertConfigRawToVars();
                                          else this.setState({readOnly: false});
                                      }}/>
                <Bootstrap.Form.Control rows={25} as={"textarea"} readOnly={this.state.readOnly}
                                        value={this.state.configRaw}
                                        onChange={(e) => this.setState({configRaw: e.target.value})}
                />
            </Bootstrap.Form>
        )
    }

    renderInteractive() {
        return (
            <Bootstrap.Form>
                <Bootstrap.Card>
                    <Bootstrap.Card.Header>Endpoint:</Bootstrap.Card.Header>
                    <Bootstrap.Card.Body>
                        <Bootstrap.Form.Group as={Bootstrap.Row}>
                            <Bootstrap.Form.Label column sm={2}>
                                Index name:
                            </Bootstrap.Form.Label>
                            <Bootstrap.Col sm={10}>
                                <Bootstrap.Form.Control placeholder="index-name" value={this.state.name}
                                                        readOnly={this.props.match.params.name}
                                                        onChange={(e) => this.setState({name: e.target.value})}/>
                            </Bootstrap.Col>
                        </Bootstrap.Form.Group>
                        <fieldset>
                            <Bootstrap.Form.Group as={Bootstrap.Row}>
                                <Bootstrap.Form.Label as="legend" column sm={2}>
                                    Updating:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                                <Bootstrap.Form.Label as="legend" column sm={2}>
                                    Source type:
                                </Bootstrap.Form.Label>
                                <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        label="SPARQL"
                                        name="typeSparqlCheck"
                                        id="typeSparqlCheck"
                                        checked={this.state.sparql}
                                        onChange={(e) => this.setState({sparql: e.target.checked})}
                                    />
                                    <Bootstrap.Form.Check
                                        inline
                                        type="switch"
                                        label="Document"
                                        name="typeDocumentCheck"
                                        id="typeDocumentCheck"
                                        checked={this.state.documents}
                                        onChange={(e) => this.setState({documents: e.target.checked})}
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
            <Bootstrap.Card>
                <Bootstrap.Card.Body>
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Form.Label as="legend" column sm={2}>
                            Include resource URI:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Form.Label as="legend" column sm={2}>
                            Add languages:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Form.Label as="legend" column sm={2}>
                            Default language:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col className={"align-items-center d-flex"} sm={1}>
                            <Bootstrap.Form.Control
                                value={this.state.language}
                                onChange={(e) => this.setState({language: e.target.value})}
                            />
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                    {this.renderUriDescription()}
                    {this.renderFiltrationList()}
                    {this.renderMappingFiltration()}
                    {this.renderPropertiesNormalization()}
                    {this.renderObjectNormalization()}
                    {this.renderMissingPropertyNormalization()}
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }

    renderObjectNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label column sm={2}>
                    Object normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col sm={10}>
                    {this.state.objectNormalization.map((pair, index) => {
                        return (<Bootstrap.Row key={index}>
                                <Bootstrap.Col sm={6}>
                                    <Bootstrap.Form.Control className={"mb-2"}
                                                            placeholder={"Quick Event"}
                                                            value={pair[0]}
                                                            onChange={(e) => {
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
                                                                this.setState(prev => {
                                                                    prev.objectNormalization[index][1] = e.target.value;
                                                                    return {objectNormalization: prev.objectNormalization};
                                                                })
                                                            }}/>
                                </Bootstrap.Col>
                            </Bootstrap.Row>
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
                    <Bootstrap.Form.Label as="legend" column sm={2}>
                        Filtration list:
                    </Bootstrap.Form.Label>
                    <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                    <Bootstrap.Col sm={2}>
                    </Bootstrap.Col>
                    <Bootstrap.Col sm={10}>
                        {this.state.filtrationList.map((address, index) => (
                            <Bootstrap.Form.Control key={index} className={"mb-2"}
                                                    placeholder={"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}
                                                    value={address}
                                                    onChange={(e) => {
                                                        this.setState(prev => {
                                                            prev.filtrationList[index] = e.target.value;
                                                            return {filtrationList: prev.filtrationList};
                                                        })
                                                    }}/>))}
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
                <Bootstrap.Form.Label column sm={2}>
                    URI description:
                </Bootstrap.Form.Label>
                <Bootstrap.Col sm={10}>
                    {this.state.URIDescription.map((pair, index) => {
                        return (<Bootstrap.Row key={index}>
                                <Bootstrap.Col sm={6}>
                                    <Bootstrap.Form.Control className={"mb-2"}
                                                            placeholder={"http://www.w3.org/2000/01/rdf-schema#label"}
                                                            value={pair[0]}
                                                            onChange={(e) => {
                                                                this.setState(prev => {
                                                                    prev.URIDescription[index][0] = e.target.value;
                                                                    return {URIDescription: prev.URIDescription};
                                                                })
                                                            }}/>
                                </Bootstrap.Col>
                                <Bootstrap.Col sm={6}>
                                    <Bootstrap.Form.Control className={"mb-2"}
                                                            placeholder={"http://purl.org/dc/terms/title"}
                                                            value={pair[1]}
                                                            onChange={(e) => {
                                                                this.setState(prev => {
                                                                    prev.URIDescription[index][1] = e.target.value;
                                                                    return {URIDescription: prev.URIDescription};
                                                                })
                                                            }}/>
                                </Bootstrap.Col>
                            </Bootstrap.Row>
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
                <Bootstrap.Form.Label as="legend" column sm={2}>
                    Missing property normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col sm={10}>
                    {this.state.missingPropertyNormalization.map((pair, index) => {
                        return (<Bootstrap.Row key={index}>
                                <Bootstrap.Col sm={6}>
                                    <Bootstrap.Form.Control className={"mb-2"}
                                                            placeholder={"http://purl.org/dc/elements/1.1/spatial"}
                                                            value={pair[0]}
                                                            onChange={(e) => {
                                                                this.setState(prev => {
                                                                    prev.missingPropertyNormalization[index][0] = e.target.value;
                                                                    return {missingPropertyNormalization: prev.missingPropertyNormalization};
                                                                })
                                                            }}/>
                                </Bootstrap.Col>
                                <Bootstrap.Col sm={6}>
                                    {pair[1].map((trackedFile, innerIndex) => {
                                        return (
                                            <Bootstrap.Row key={index + ":" + innerIndex}>
                                                <Bootstrap.Col>
                                                    <Bootstrap.Form.Control className={"mb-2"}
                                                                            placeholder={"Other"}
                                                                            value={trackedFile}
                                                                            onChange={(e) => {
                                                                                this.setState(prev => {
                                                                                    prev.missingPropertyNormalization[index][1][innerIndex] = e.target.value;
                                                                                    return {missingPropertyNormalization: prev.missingPropertyNormalization};
                                                                                })
                                                                            }}/>
                                                </Bootstrap.Col>
                                            </Bootstrap.Row>
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
                            </Bootstrap.Row>
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
                <Bootstrap.Form.Label as="legend" column sm={2}>
                    Properties normalization:
                </Bootstrap.Form.Label>
                <Bootstrap.Col sm={10}>
                    {this.state.propertiesNormalization.map((pair, index) => {
                        return (<Bootstrap.Row key={index}>
                                <Bootstrap.Col sm={6}>
                                    <Bootstrap.Form.Control className={"mb-2"}
                                                            placeholder={"http://purl.org/dc/elements/1.1/format"}
                                                            value={pair[0]}
                                                            onChange={(e) => {
                                                                this.setState(prev => {
                                                                    prev.propertiesNormalization[index][0] = e.target.value;
                                                                    return {propertiesNormalization: prev.propertiesNormalization};
                                                                })
                                                            }}/>
                                </Bootstrap.Col>
                                <Bootstrap.Col sm={6}>
                                    {pair[1].map((trackedFile, innerIndex) => {
                                        return (
                                            <Bootstrap.Row key={index + ":" + innerIndex}>
                                                <Bootstrap.Col>
                                                    <Bootstrap.Form.Control className={"mb-2"}
                                                                            placeholder={"format"}
                                                                            value={trackedFile}
                                                                            onChange={(e) => {
                                                                                this.setState(prev => {
                                                                                    prev.propertiesNormalization[index][1][innerIndex] = e.target.value;
                                                                                    return {propertiesNormalization: prev.propertiesNormalization};
                                                                                })
                                                                            }}/>
                                                </Bootstrap.Col>
                                            </Bootstrap.Row>
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
                            </Bootstrap.Row>
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
                        <Bootstrap.Form.Label as="legend" column sm={2}>
                            Mapping filtration:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                        <Bootstrap.Col sm={2}>
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={10}>
                            {this.state.mappingFiltration.map((pair, index) => {
                                return (<Bootstrap.Row key={index}>
                                        <Bootstrap.Col sm={6}>
                                            <Bootstrap.Form.Control className={"mb-2"}
                                                                    placeholder={"http://www.w3.org/1999/02/22-rdf-syntax-ns#typ"}
                                                                    value={pair[0]}
                                                                    onChange={(e) => {
                                                                        this.setState(prev => {
                                                                            prev.mappingFiltration[index][0] = e.target.value;
                                                                            return {mappingFiltration: prev.mappingFiltration};
                                                                        })
                                                                    }}/>
                                        </Bootstrap.Col>
                                        <Bootstrap.Col sm={6}>
                                            {pair[1].map((trackedFile, innerIndex) => {
                                                return (
                                                    <Bootstrap.Row key={index + ":" + innerIndex}>
                                                        <Bootstrap.Col>
                                                            <Bootstrap.Form.Control className={"mb-2"}
                                                                                    placeholder={"Tracked File"}
                                                                                    value={trackedFile}
                                                                                    onChange={(e) => {
                                                                                        this.setState(prev => {
                                                                                            prev.mappingFiltration[index][1][innerIndex] = e.target.value;
                                                                                            return {mappingFiltration: prev.mappingFiltration};
                                                                                        })
                                                                                    }}/>
                                                        </Bootstrap.Col>
                                                    </Bootstrap.Row>
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
                                    </Bootstrap.Row>
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
                        <Bootstrap.Form.Label column sm={2}>
                            SPARQL endpoint:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col sm={10}>
                            <Bootstrap.Form.Control placeholder="https://example.org/sparql"
                                                    value={this.state.sparqlEndpoint}
                                                    onChange={(e) => this.setState({sparqlEndpoint: e.target.value})}/>
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                    <fieldset>
                        <Bootstrap.Form.Group as={Bootstrap.Row}>
                            <Bootstrap.Form.Label as="legend" column sm={2}>
                                Query type:
                            </Bootstrap.Form.Label>
                            <Bootstrap.Col className={"align-items-center d-flex"} sm={10}>
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
                        <Bootstrap.Form.Label column sm={2}>
                            Query:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col sm={10}>
                            {this.state.queries.map((query, index) => (
                                <Bootstrap.Form.Control key={index} className={"mb-2"} rows={3} as={"textarea"}
                                                        value={query}
                                                        onChange={(e) => {
                                                            this.setState(prev => {
                                                                prev.queries[index] = e.target.value;
                                                                return {queries: prev.queries};
                                                            })
                                                        }}/>))}
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
                        <Bootstrap.Form.Label column sm={2}>
                            Addresses:
                        </Bootstrap.Form.Label>
                        <Bootstrap.Col sm={10}>
                            {this.state.documentAddresses.map((address, index) => (
                                <Bootstrap.Form.Control key={index} className={"mb-2"}
                                                        placeholder={"https://example.org/dataset.ttl"}
                                                        value={address}
                                                        onChange={(e) => {
                                                            this.setState(prev => {
                                                                prev.documentAddresses[index] = e.target.value;
                                                                return {documentAddresses: prev.documentAddresses};
                                                            })
                                                        }}/>))}


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
        return (
            <Bootstrap.Card className={"ml-5 mb-2"}>
                <Bootstrap.Card.Body>
                    <Bootstrap.Form.Row>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Second</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="second"
                                value={schedule[0]}
                                onChange={(e) => {
                                    schedule[0] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Minute</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="minute"
                                value={schedule[1]}
                                onChange={(e) => {
                                    schedule[1] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Hour</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="hour"
                                value={schedule[2]}
                                onChange={(e) => {
                                    schedule[2] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Day of month</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="dayOfMonth"
                                value={schedule[3]}
                                onChange={(e) => {
                                    schedule[3] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Month</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="month"
                                value={schedule[4]}
                                onChange={(e) => {
                                    schedule[4] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                        <Bootstrap.Form.Group as={Bootstrap.Col} md="2">
                            <Bootstrap.Form.Label>Day of week</Bootstrap.Form.Label>
                            <Bootstrap.Form.Control
                                type="text"
                                name="dayOfWeek"
                                value={schedule[5]}
                                onChange={(e) => {
                                    schedule[5] = e.target.value;
                                    this.setState({schedule: schedule});
                                }}
                            />
                        </Bootstrap.Form.Group>
                    </Bootstrap.Form.Row>
                </Bootstrap.Card.Body>
            </Bootstrap.Card>
        )
    }
}

export default withRouter(Edit);