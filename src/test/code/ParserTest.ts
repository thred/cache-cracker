/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("division of an area and a length: 0.5 m² / 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("0.5 m² / 50 cm"));

        assert.equal(expression.describe(), "0.5 m² / 50 cm");
        assert.equal(expression.invoke().toString(), "1 m");
    });

    it("power of a length: 2 m ^ 3", () => {
        let expression = Parser.parseExpression(Parser.scan("2 m ^ 3"));

        assert.equal(expression.describe(), "2 m ^ 3");
        assert.equal(expression.invoke().toString(), "8 m³");
    });

});
