/// <reference path="../imports.d.ts" />

import * as Code from "../../script/code/Code";
import * as Parser from "../../script/code/Parser";
import {Scope} from "../../script/code/Scope";
import * as ReadLine from "readline";

const con = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

function consume() {
    setImmediate(() => {
        con.question("> ", (input) => {
            try {
                let expression = Parser.parseExpression(Parser.scan(input));

                console.log("Reading: " + expression.describe());
                console.log("Result:  " + expression.invoke(Code.global.derive()));
            }
            catch (error) {
                console.log(error.message);
            }

            consume();
        });
    });
}

consume();
