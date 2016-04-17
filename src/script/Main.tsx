/// <reference path="imports.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import * as Command from "./command/Command";
import * as SheetModel from "./sheet/Model";
import * as SheetUI from "./sheet/UI";

import * as StringCommand from "./command/StringCommand";

function init() {

    Command.register({
        key: "String",
        category: "Input",
        resultType: Command.Type.String,
        componentFactory: (instruction) => <div>lala</div>
    });

    Command.register({
        key: "Number",
        category: "Input",
        resultType: Command.Type.Number,
        componentFactory: null
    });

    Command.register({
        key: "Boolean",
        category: "Input",
        resultType: Command.Type.Boolean,
        componentFactory: null
    });

    let sheet: SheetModel.Sheet = SheetModel.ensureIdentableSheet({
        name: "Test Sheet",
        image: "media/sheet-title-schober.jpg",
        author: "Thred",
        lines: [{
            key: "A",
            comment: "Wie lautet das gesuchte Wort?",
            instruction: {
                definitionKey: "String",
                value: "Blahbliblahbliblups"
            }
        }]
    });

    ReactDOM.render(<SheetUI.SheetComponent sheet={sheet} onAction={(action) => console.log(action) }/>, document.getElementById("main"));

}

init();

