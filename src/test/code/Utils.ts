/// <reference path="../imports.d.ts" />

import {Scanner} from "../../script/code/Scanner";
import {Scope} from "../../script/code/Scope";

import * as Code from "../../script/code/Code";
import * as Parser from "../../script/code/Parser";

import {assert} from "chai";

export function testExpression(code: string, result: string): Scope {
    let scope = Code.global.derive();

    it(`${code} => ${result}`, () => {
        let description = code;

        if (code.indexOf(":") >= 0) {
            description = code.substring(code.indexOf(":") + 1).trim();
            code = code.substring(0, code.indexOf(":")).trim();
        }

        let expression = Parser.parseExpression(Parser.scan(code));

        assert.equal(expression.describe(), description);
        assert.equal(expression.invoke(scope).toString(), result);
    });

    return scope;
}


