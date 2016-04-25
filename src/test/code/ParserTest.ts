/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("convert an inch: (1 in) in in", () => {
        let expression = Parser.parseExpression(Parser.scan("(1 in) in in"));

        assert.equal(expression.describe(), "(1 in) in in");
        assert.equal(expression.invoke(), "1 in");
    });

});
