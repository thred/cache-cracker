/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("add two numbers: 1 + 2", () => {
        let expression = Parser.parseExpression(Parser.scan("1 + 2"));

        assert.equal(expression.describe(), "1 + 2");
        assert.equal(expression.invoke(), 3);
    });

    it("subtract two numbers: 3 - 2", () => {
        let expression = Parser.parseExpression(Parser.scan("3 - 2"));

        assert.equal(expression.describe(), "3 - 2");
        assert.equal(expression.invoke(), 1);
    });

    
});
