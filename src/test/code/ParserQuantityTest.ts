/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser (Quantity)", () => {

    it("read a quantity: 1.5 m", () => {
        let expression = Parser.parseExpression(Parser.scan("1.5 m"));

        assert.equal(expression.describe(), "1.5 m");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("convert a unit: 0.5 m in cm", () => {
        let expression = Parser.parseExpression(Parser.scan("0.5 m in cm"));

        assert.equal(expression.describe(), "0.5 m in cm");
        assert.equal(expression.invoke(), "50 cm");
    });

    it("read chained quantities: 1 m 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m 50 cm"));

        assert.equal(expression.describe(), "1 m 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("convert an inch: (1 in) in in", () => {
        let expression = Parser.parseExpression(Parser.scan("(1 in) in in"));

        assert.equal(expression.describe(), "(1 in) in in");
        assert.equal(expression.invoke(), "1 in");
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

    it("addition of lengths: 1 m + 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m + 50 cm"));

        assert.equal(expression.describe(), "1 m + 50 cm");
        assert.equal(expression.invoke(), "1.5 m");
    });

    it("subtraction of lengths: 1 m - 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m - 50 cm"));

        assert.equal(expression.describe(), "1 m - 50 cm");
        assert.equal(expression.invoke(), "0.5 m");
    });

    it("multiplication of lengths: 1 m * 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m * 50 cm"));

        assert.equal(expression.describe(), "1 m * 50 cm");
        assert.equal(expression.invoke(), "0.5 m²");
    });

    it("multiplication of a length and an area: 1 m * 50 cm²", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m * 50 cm²"));

        assert.equal(expression.describe(), "1 m * 50 cm²");
        assert.equal(expression.invoke(), "0.005 m³");
    });

    it("division of an area and a length: 0.5 m² / 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("0.5 m² / 50 cm"));

        assert.equal(expression.describe(), "0.5 m² / 50 cm");
        assert.equal(expression.invoke(), "1 m");
    });

    it("power of a length: 2 m ^ 3", () => {
        let expression = Parser.parseExpression(Parser.scan("2 m ^ 3"));

        assert.equal(expression.describe(), "2 m ^ 3");
        assert.equal(expression.invoke(), "8 m³");
    });

    it("modulo: 3 m mod 200 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("3 m mod 200 cm"));

        assert.equal(expression.describe(), "3 m mod 200 cm");
        assert.equal(expression.invoke(), "1 m");
    });

});
