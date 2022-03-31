import React from "react";
import * as Bootstrap from "react-bootstrap";
import "./Edit.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
import api from "../../settings";
import InteractiveTab from "./InteractiveTab";
import RawTab from "./RawTab";

class Tabs extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            name: "",
            incrementally: false,
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
        if (this.props.id) api.get('configs/' + this.props.id).then((response) => {
            this.setState({config: response.data}, () =>
                this.setState({configRaw: JSON.stringify(this.state.config, null, 7)}, () => {
                        this.setStateFromConfig();
                    }
                )
            );
        }).catch((error) => {
            if(error.message==="Request failed with status code 404") window.location.replace("/notfound")
            this.props.addAlert({
                variant: "danger",
                title: "Get configs request error",
                message: error,
                durationSec: 300
            })
        })

    }

    render() {
        return (<>
                {this.createSaveButtons()}
                {this.preparePopups()}
                <Bootstrap.Tabs defaultActiveKey="interactive" onSelect={(name) => {
                    if (name === "raw") this.convertVarsToConfig();
                }}>
                    <Bootstrap.Tab eventKey="interactive" title="Interactive" disabled={!this.state.readOnly}>
                        <Bootstrap.Card className={"border-top-0"}>
                            <Bootstrap.Card.Body>
                                <InteractiveTab parent={this}/>
                            </Bootstrap.Card.Body>
                        </Bootstrap.Card>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="raw" title="RAW">
                        <Bootstrap.Card className={"border-top-0"}>
                            <Bootstrap.Card.Body>
                                <RawTab parent={this}/>
                            </Bootstrap.Card.Body>
                        </Bootstrap.Card>
                    </Bootstrap.Tab>
                </Bootstrap.Tabs>
            </>
        )
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
            incrementally: this.state.incrementally,
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
            incrementally: false,
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
            if (this.state.config.incrementally !== undefined) {
                this.setState({incrementally: this.state.config.incrementally});
            }
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
                    if (this.state.config.config.index.index) this.setState({name: this.state.config.config.index.index},()=>{
                        this.props.parent.setState({name: this.state.name});
                    });
                }
            }
        });
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

    preparePopups() {
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
}

export default Tabs;