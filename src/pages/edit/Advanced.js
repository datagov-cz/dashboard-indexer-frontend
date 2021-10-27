import * as Bootstrap from "react-bootstrap";
import React from "react";
import PairInput from "./PairInput";
import SingleInput from "./SingleInput";
import OneToManyPairInput from "./OneToManyPairInput";

class Advanced extends React.Component{
    render() {
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
                                        checked={this.props.parent.state.includeResourceURI}
                                        onChange={(e) => this.props.parent.setState({includeResourceURI: e.target.checked})}
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
                                        checked={this.props.parent.state.addLanguage}
                                        onChange={(e) => this.props.parent.setState({addLanguage: e.target.checked})}
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
                                        value={this.props.parent.state.language}
                                        onChange={(e) => this.props.parent.setState({language: e.target.value})}
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
                <PairInput parent={this.props.parent} data={this.props.parent.state.objectNormalization} dataName={"objectNormalization"}
                           placeholder1={"Quick Event"} placeholder2={"Event"}/>
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
                            checked={this.props.parent.state.filtrationListType === "none"}
                            onChange={(e) => {
                                if (e.target.checked) this.props.parent.setState({filtrationListType: "none"})
                            }}
                        />
                        <Bootstrap.Form.Check
                            inline
                            type="radio"
                            label="Whitelist"
                            name="filtrationListType"
                            checked={this.props.parent.state.filtrationListType === "white"}
                            onChange={(e) => {
                                if (e.target.checked) this.props.parent.setState({filtrationListType: "white"})
                            }}
                        />
                        <Bootstrap.Form.Check
                            inline
                            type="radio"
                            label="Blacklist"
                            name="filtrationListType"
                            checked={this.props.parent.state.filtrationListType === "black"}
                            onChange={(e) => {
                                if (e.target.checked) this.props.parent.setState({filtrationListType: "black"})
                            }}
                        />
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
            </fieldset>
            <Bootstrap.Collapse in={this.props.parent.state.filtrationListType !== "none"}>
                <Bootstrap.Form.Group as={Bootstrap.Row}>
                    <Bootstrap.Col md={2}>
                    </Bootstrap.Col>
                    <SingleInput parent={this.props.parent} data={this.props.parent.state.filtrationList} dataName={"filtrationList"}
                                 placeholder={"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}/>
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
                <PairInput parent={this.props.parent} data={this.props.parent.state.URIDescription} dataName={"URIDescription"}
                           placeholder1={"http://www.w3.org/2000/01/rdf-schema#label"}
                           placeholder2={"http://purl.org/dc/terms/title"}/>
            </Bootstrap.Form.Group>
        )
    }

    renderMissingPropertyNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label as="legend" column md={2}>
                    Missing property normalization:
                </Bootstrap.Form.Label>
                <OneToManyPairInput parent={this.props.parent} data={this.props.parent.state.missingPropertyNormalization} dataName={"missingPropertyNormalization"}
                                    placeholder1={"http://purl.org/dc/elements/1.1/spatial"}
                                    placeholder2={"Other"}/>
            </Bootstrap.Form.Group>
        )
    }

    renderPropertiesNormalization() {
        return (
            <Bootstrap.Form.Group as={Bootstrap.Row}>
                <Bootstrap.Form.Label as="legend" column md={2}>
                    Properties normalization:
                </Bootstrap.Form.Label>
                <OneToManyPairInput parent={this.props.parent} data={this.props.parent.state.propertiesNormalization} dataName={"propertiesNormalization"}
                                    placeholder1={"http://purl.org/dc/elements/1.1/format"}
                                    placeholder2={"format"}/>
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
                                checked={this.props.parent.state.mappingFiltrationType === "none"}
                                onChange={(e) => {
                                    if (e.target.checked) this.props.parent.setState({mappingFiltrationType: "none"})
                                }}
                            />
                            <Bootstrap.Form.Check
                                inline
                                type="radio"
                                label="WhiteMap"
                                name="mappingFiltrationType"
                                checked={this.props.parent.state.mappingFiltrationType === "whiteMap"}
                                onChange={(e) => {
                                    if (e.target.checked) this.props.parent.setState({mappingFiltrationType: "whiteMap"})
                                }}
                            />
                            <Bootstrap.Form.Check
                                inline
                                type="radio"
                                label="BlackMap"
                                name="mappingFiltrationType"
                                checked={this.props.parent.state.mappingFiltrationType === "blackMap"}
                                onChange={(e) => {
                                    if (e.target.checked) this.props.parent.setState({mappingFiltrationType: "blackMap"})
                                }}
                            />
                        </Bootstrap.Col>
                    </Bootstrap.Form.Group>
                </fieldset>
                <Bootstrap.Collapse in={this.props.parent.state.mappingFiltrationType !== "none"}>
                    <Bootstrap.Form.Group as={Bootstrap.Row}>
                        <Bootstrap.Col md={2}>
                        </Bootstrap.Col>
                        <OneToManyPairInput parent={this.props.parent} data={this.props.parent.state.mappingFiltration} dataName={"mappingFiltration"}
                                            placeholder1={"http://www.w3.org/1999/02/22-rdf-syntax-ns#typ"}
                                            placeholder2={"Tracked File"}/>
                    </Bootstrap.Form.Group>
                </Bootstrap.Collapse>
            </>
        )
    }
}
export default  Advanced;