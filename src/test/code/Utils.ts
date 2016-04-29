/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

export class TestContext extends Parser.Context {


}

export function testExpression(code: string, result: string): TestContext {
    let context = new TestContext();

    it(`${code} => ${result}`, () => {
        let description = code;

        if (code.indexOf(":") >= 0) {
            description = code.substring(code.indexOf(":") + 1).trim();
            code = code.substring(0, code.indexOf(":")).trim();
        }

        let expression = Parser.parseExpression(Parser.scan(code), context);

        assert.equal(expression.describe(), description);
        assert.equal(expression.invoke().toString(), result);
    });

    return context;
}

