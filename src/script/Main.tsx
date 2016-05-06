/// <reference path="imports.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import * as Command from "./command/Command";
import * as SheetModel from "./sheet/Model";
import * as Sheet from "./sheet/Sheet";

function init() {

    let sheet: SheetModel.Sheet = SheetModel.ensureIdentable({
        name: "Test Sheet",
        image: "media/sheet-title-schober.jpg",
        author: "Thred",
        lines: [{
            key: "A",
            comment: "Wie lautet das gesuchte Wort?",
            instruction: {
                definitionKey: "String",
                stringValue: "Blahbliblahbliblups"
            }
        },
            {
                instruction: {
                    definitionKey: "String"
                }
            }]
    });

    ReactDOM.render(<Sheet.Component defaultSheet={sheet}/>, document.getElementById("main"));

}

init();

