/// <reference path="../imports.d.ts" />

import {Environment} from "../../script/code/Environment";
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
                let script = Environment.DEFAULT.parse(input);

                console.log("Reading: " + script.describe());
                console.log("Result:  " + script.execute());
            }
            catch (error) {
                console.log(error.message);
            }

            consume();
        });
    });
}

consume();
