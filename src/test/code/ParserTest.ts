/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("power a length: 2 m ^ 3", () => {
        let expression = Parser.parseExpression(Parser.scan("2 m ^ 3"));

        assert.equal(expression.describe(), "2 m ^ 3");
        console.log(expression.invoke());
        assert.equal(expression.invoke(), "8 m³");
    });

});
