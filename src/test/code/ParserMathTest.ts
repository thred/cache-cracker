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

    it("multiply two numbers: 2 * 3", () => {
        let expression = Parser.parseExpression(Parser.scan("2 * 3"));

        assert.equal(expression.describe(), "2 * 3");
        assert.equal(expression.invoke(), 6);
    });

    it("divide two numbers: 6 / 3", () => {
        let expression = Parser.parseExpression(Parser.scan("6 / 3"));

        assert.equal(expression.describe(), "6 / 3");
        assert.equal(expression.invoke(), 2);
    });

});
