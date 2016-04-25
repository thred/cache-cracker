/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser (Math)", () => {

    it("positive number: +2", () => {
        let expression = Parser.parseExpression(Parser.scan("+2"));

        assert.equal(expression.describe(), "+2");
        assert.equal(expression.invoke(), 2);
    });

    it("negative number: -2", () => {
        let expression = Parser.parseExpression(Parser.scan("-2"));

        assert.equal(expression.describe(), "-2");
        assert.equal(expression.invoke(), -2);
    });

    it("addition: 1 + 2", () => {
        let expression = Parser.parseExpression(Parser.scan("1 + 2"));

        assert.equal(expression.describe(), "1 + 2");
        assert.equal(expression.invoke(), 3);
    });

    it("subtraction: 3 - 2", () => {
        let expression = Parser.parseExpression(Parser.scan("3 - 2"));

        assert.equal(expression.describe(), "3 - 2");
        assert.equal(expression.invoke(), 1);
    });

    it("multiplication: 2 * 3", () => {
        let expression = Parser.parseExpression(Parser.scan("2 * 3"));

        assert.equal(expression.describe(), "2 * 3");
        assert.equal(expression.invoke(), 6);
    });

    it("division: 6 / 3", () => {
        let expression = Parser.parseExpression(Parser.scan("6 / 3"));

        assert.equal(expression.describe(), "6 / 3");
        assert.equal(expression.invoke(), 2);
    });

    it("power: 4 ^ 3 ^ 2", () => {
        let expression = Parser.parseExpression(Parser.scan("4 ^ 3 ^ 2"));

        assert.equal(expression.describe(), "4 ^ 3 ^ 2");
        assert.equal(expression.invoke(), 262144);
    });

    it("modulo: 3 mod 2", () => {
        let expression = Parser.parseExpression(Parser.scan("3 mod 2"));

        assert.equal(expression.describe(), "3 mod 2");
        assert.equal(expression.invoke(), "1");
    });

    it("operator precedence: 2 * 3 + 4 / 2", () => {
        let expression = Parser.parseExpression(Parser.scan("2 * 3 + 4 / 2"));

        assert.equal(expression.describe(), "2 * 3 + 4 / 2");
        assert.equal(expression.invoke(), 8);
    });

    it("parentheses: 2 * (3 + 4) / 2", () => {
        let expression = Parser.parseExpression(Parser.scan("2 * (3 + 4) / 2"));

        assert.equal(expression.describe(), "2 * (3 + 4) / 2");
        assert.equal(expression.invoke(), 7);
    });


});
