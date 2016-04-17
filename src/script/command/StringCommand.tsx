import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import * as SheetModel from "./../sheet/Model";

export class Component extends React.Component<SheetModel.Instruction, {}> {
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
