/// <reference path="../imports.d.ts" />

import {Code} from "../../script/code/Code";
import {Scope} from "../../script/code/Scope";

import * as Parser from "../../script/code/Parser";

import {assert} from "chai";

export function testStatement(source: string, result: string): Scope {
    let scope = new Scope(null);

    it(`${source} => ${result}`, () => {
        let description = source;

        if (source.indexOf(":") >= 0) {
            description = source.substring(source.indexOf(":") + 1).trim();
            source = source.substring(0, source.indexOf(":")).trim();
        }

        let code = new Code();
        let statement = code.parse(source);

        assert.equal(statement.describe(), description);

        assert.equal(code.execute(statement).toString(), result);
    });

    return scope;
}


