/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("parse a number: 42.1", () => {
        let expression = Parser.parseExpression(Parser.scan("42.1"));

        assert.equal(expression.describe(), "42.1");

        let result = expression.invoke();

        assert.equal(result, 42.1);
    });

    it("parse a plain string: \"a string\"", () => {
        let expression = Parser.parseExpression(Parser.scan("\"a string\""));

        assert.equal(expression.describe(), "\"a string\"");

        let result = expression.invoke();

        assert.equal(result, "a string");
    });

    it("parse a simple placeholder string: \"a ${2}nd string\"", () => {
        let expression = Parser.parseExpression(Parser.scan("\"a ${2}nd string\""));

        assert.equal(expression.describe(), "\"a ${2}nd string\"");

        let result = expression.invoke();

        assert.equal(result, "a 2nd string");
    });

});
