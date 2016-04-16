/// <reference path="refs.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import StringCommand from "./command/StringCommand";

function init() {

    ReactDOM.render(
        <div>
            <Row>
                <Col>
                    <Button icon="cloud" waves="light">
                        This is a Button
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Input label="Testvalue"/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Input type="select" label="A Select">
                        <optgroup label="team 1">
                            <option value="1">A number</option>
                            <option value="1">A string</option>
                        </optgroup>
                        <optgroup label="team 1">
                            <option value="1">A number</option>
                            <option value="1">A string</option>
                        </optgroup>
                    </Input>
                </Col>
            </Row>
            <StringCommand />
        </div>, document.getElementById("main"));

}

init();

