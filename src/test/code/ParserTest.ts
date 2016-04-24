/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("operator precedence: 2 * 3 + 4 / 2", () => {
        let expression = Parser.parseExpression(Parser.scan("2 * 3 + 4 / 2"));

        assert.equal(expression.describe(), "2 * 3 + 4 / 2");

        console.log(expression.toString());
        assert.equal(expression.invoke(), 8);
    });

});
