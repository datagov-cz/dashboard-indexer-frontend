import React from "react";

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

export default AddRowButton;