/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser (Basic)", () => {

    it("parse a number: 42.1", () => {
        let expression = Parser.parseExpression(Parser.scan("42.1"));

        assert.equal(expression.describe(), "42.1");
        assert.equal(expression.invoke(), 42.1);
    });

    it("parse a plain string: \"a string\"", () => {
        let expression = Parser.parseExpression(Parser.scan("\"a string\""));

        assert.equal(expression.describe(), "\"a string\"");
        assert.equal(expression.invoke(), "a string");
    });

    it("parse a simple placeholder string: \"a ${2}nd string\"", () => {
        let expression = Parser.parseExpression(Parser.scan("\"a ${2}nd string\""));

        assert.equal(expression.describe(), "\"a ${2}nd string\"");
        assert.equal(expression.invoke(), "a 2nd string");
    });

});