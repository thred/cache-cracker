/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("add two numbers: 1 + 2", () => {
        let expression = Parser.parseExpression(Parser.scan("1 + 2"));

        assert.equal(expression.describe(), "1 + 2");

        let result = expression.invoke();

        assert.equal(result, 3);
    });

    it("add two lengths: 1 m + 50 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m + 50 cm"));

        assert.equal(expression.describe(), "1 m + 50 cm");

        let result = expression.invoke();

        assert.equal(result, "1.5 m");
    });

});
