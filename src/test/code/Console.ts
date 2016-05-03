/// <reference path="../imports.d.ts" />

import {Scope} from "../../script/code/Scope";

import * as Code from "../../script/code/Code";
import * as Parser from "../../script/code/Parser";

import * as ReadLine from "readline";

const con = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

function consume() {
    setImmediate(() => {
        con.question("> ", (input) => {
            try {
                let command = Code.parse(input);

                console.log("Reading: " + command.describe());
                console.log("Result:  " + command.invoke(new Scope(null)));
            }
            catch (error) {
                console.log(error.message);
            }

            consume();
        });
    });
}

consume();
