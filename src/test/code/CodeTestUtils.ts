/// <reference path="../imports.d.ts" />

import {Scope} from "../../script/code/Scope";

import * as Code from "../../script/code/Code";
import * as Parser from "../../script/code/Parser";

import {assert} from "chai";

export function testStatement(code: string, result: string): Scope {
    let scope = new Scope(null);

    it(`${code} => ${result}`, () => {
        let description = code;

        if (code.indexOf(":") >= 0) {
            description = code.substring(code.indexOf(":") + 1).trim();
            code = code.substring(0, code.indexOf(":")).trim();
        }

        let statement = Code.parse(code);

        assert.equal(statement.describe(), description);
        assert.equal(statement.invoke(new Scope(null)).toString(), result);
    });

    return scope;
}


