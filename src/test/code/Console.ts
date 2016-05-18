/// <reference path="../imports.d.ts" />

import {Context} from "../../script/code/Context";
import {Definition} from "../../script/code/Definition";
import {Environment} from "../../script/code/Environment";
import {Module} from "../../script/code/Module";
import {Msg, msg, defMsg} from "../../script/code/Msg";
import {Scope} from "../../script/code/Scope";

import * as Globals from "../../script/code/Globals";
import * as Utils from "../../script/code/Utils";

import * as ReadLine from "readline";

const con = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

class ConsoleModule extends Module {
    constructor() {
        super();

        this.register(Definition.procedure({
            "": "reset",
            "de": "zurücksetzen"
        }, {
                "": "Resets the console.",
                "de": "Setzt die Konsole zurück."
            }, [
                Definition.any(Globals.VAR_ACCENT, {
                    "": "The accent.",
                    "de": "Der Akzent."
                }, Globals.DEFAULT_ACCENT)],
            Definition.any(Globals.VAR_RESULT, {
                "": "The procedure does not return any value.",
                "de": "Die Prozedur liefert keinen Wert zurück."
            }), (scope) => {
                reset(scope.requiredAsText(Globals.VAR_ACCENT));
            }));
    }
}

const CONSOLE_MODULE = new ConsoleModule();

let environment: Environment;
let context: Context;
let scope: Scope;

function reset(accent: string): void {
    environment = Environment.createDefault(accent);

    environment.include(CONSOLE_MODULE);
    
    context = environment.createContext();
    scope = context.createScope();
}

reset(Globals.DEFAULT_ACCENT);

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
        console.log(Utils.toScript(environment.accent, script.execute(scope)));
    }
    catch (error) {
        console.log(error.message);
    }
}

function help(args: string[]) {
    let q = args.length > 1 ? args[1] : "";
    let definition = context.get(q);

    if (definition) {
        console.log(definition.toScript(environment.accent));
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

    definitions.sort((a, b) => a.getName(environment.accent).localeCompare(b.getName(environment.accent)));

    console.log("List of definitions:\n");
    for (let definition of definitions) {
        console.log(definition.getName(environment.accent));
    }
}

console.log("Type \"help\".");

consume();
