/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("read a quantity: 1.5 m", () => {
        let expression = Parser.parseExpression(Parser.scan("1.5 m"));

        assert.equal(expression.describe(), "1.5 m");
        assert.equal(expression.invoke(), "1.5 m");

        expression = Parser.parseExpression(Parser.scan("1.5m"));

        assert.equal(expression.describe(), "1.5 m");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("read a chained quantity: 1 m 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m 50 cm"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");

        expression = Parser.parseExpression(Parser.scan("1m50cm"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("read a chained quantity guessing the unit: 1 m 50", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m 50"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("add two lengths: 1 m + 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m + 50 cm"));

        assert.equal(expression.describe(), "1 m + 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

});
