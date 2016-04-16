/// <reference path="../refs.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

interface StringCommandProps {
    comment?: string;
}

export default class StringCommand extends React.Component<StringCommandProps, {}> {

    render() {
        let label = "String";

        return <div>
            <Row>
                <Col>
                    <Input label={label} />
                </Col>
            </Row>
        </div>;
    }
}
