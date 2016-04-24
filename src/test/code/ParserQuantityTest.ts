/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("read a quantity: 1.5 m", () => {
        let expression = Parser.parseExpression(Parser.scan("1.5 m"));

        assert.equal(expression.describe(), "1.5 m");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("read chained quantities: 1 m 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m 50 cm"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("read chained quantities guessing the unit: 1 m 50", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m 50"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("fail on invalid chained quantities: 1 m 50 km", () => {
        try {
            Parser.parseExpression(Parser.scan("1 m 50 km"));
            assert.fail();
        }
        catch (e) {
        }
    });

    it("add two lengths: 1 m + 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m + 50 cm"));

        assert.equal(expression.describe(), "1 m + 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("subtract two lengths: 1 m - 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m - 50 cm"));

        assert.equal(expression.describe(), "1 m - 50 cm");
        assert.equal(expression.invoke(), "0.5 m");
    });

    it("multiply two lengths: 1 m * 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m * 50 cm"));

        assert.equal(expression.describe(), "1 m * 50 cm");
        assert.equal(expression.invoke(), "0.5 m²");
    });

    it("multiply a length and an area: 1 m * 50 cm²", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m * 50 cm²"));

        assert.equal(expression.describe(), "1 m * 50 cm²");
        assert.equal(expression.invoke(), "0.005 m³");
    });

    it("divide an area and a length: 0.5 m² / 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("0.5 m² / 50 cm"));

        assert.equal(expression.describe(), "0.5 m² / 50 cm");
        assert.equal(expression.invoke(), "1 m");
    });

});
