/// <reference path="../imports.d.ts" />

import {Context} from "../../script/code/Context";
import {Definition} from "../../script/code/Definition";
import {Environment} from "../../script/code/Environment";
import {Scope} from "../../script/code/Scope";

import * as Utils from "../../script/code/util/Utils";

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
            input = input.trim();

            let split = input.split(" ");

            if ((split.length > 0) && (split[0] === "help")) {
                help(split);
            }
            else {
                parse(input);
            }

            consume();
        });
    });
}

function parse(input: string) {
    try {
        let script = context.parse(input);

        // console.log("Reading: " + script.describe());
        console.log(Utils.describe(script.execute(scope)));
    }
    catch (error) {
        console.log(error.message);
    }
}

function help(args: string[]) {
    let q = args.length > 1 ? args[1] : "";
    let definition = context.get(q);

    if (definition) {
        console.log(definition.describe());
    }
    else {
        list(q);
    }
}

function list(q: string) {
    let definitions: Definition[] = [];
    let ctx = context;

    while (ctx) {
        for (let name in ctx.definitions) {
            if (name.indexOf(q) >= 0) {
                definitions.push(ctx.get(name));
            }
        }

        ctx = ctx.parent;
    }

    definitions.sort((a, b) => a.name.localeCompare(b.name));

    console.log("List of definitions:\n");
    for (let definition of definitions) {
        console.log(definition.name);
    }
}

console.log("Type \"help\".");

consume();
