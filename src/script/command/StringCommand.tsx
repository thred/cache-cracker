import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import * as Model from "./../Model";

export class Component extends React.Component<Model.Instruction, {}> {
    render() {
        return <div className="command">
            <Row>
                <Col>
                    <Input type="text" label="Value" />
                </Col>
            </Row>
        </div>;
    }
}
