import React from 'react';
import './Home.css';
import * as Bootstrap from 'react-bootstrap';
import IndexTable from "./IndexTable";

class Home extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1 className={"mb-0"}>
                            Indexes
                        </h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <IndexTable {...this.props}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default Home;
