/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
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
                let expression = Parser.parseExpression(Parser.scan(input));

                console.log("Reading: " + expression.describe());
                console.log("Result:  " + expression.invoke());
            }
            catch (e) {
                console.log(e.message);
            }

            consume();
        });
    });
}

consume();
