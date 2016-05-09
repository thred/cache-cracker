/// <reference path="../imports.d.ts" />

import {Context} from "../../script/code/Context";
import {Environment} from "../../script/code/Environment";
import {Scope} from "../../script/code/Scope";

import * as ReadLine from "readline";

const con = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let context: Context = Environment.DEFAULT.createContext();
let scope: Scope = context.createScope();

function consume() {
    setImmediate(() => {
        con.question("> ", (input) => {
            try {
                let script = context.parse(input);

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
