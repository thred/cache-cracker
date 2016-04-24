/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";

describe("Parser", () => {

    it("modulo: 3 m mod 200 cm", () => {
        let expression = Parser.parseExpression(Parser.scan("3 m mod 200 cm"));

        assert.equal(expression.describe(), "3 m mod 200 cm");
        console.log(expression.invoke());
        assert.equal(expression.invoke(), "1 m");
    });

});
