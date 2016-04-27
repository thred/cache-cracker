/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Parser from "../../script/code/Parser";
import {assert} from "chai";


describe("Parser (Speed)", () => {

    it("read a speed: 1 m/s", () => {
        let expression = Parser.parseExpression(Parser.scan("1 m/s"));

        assert.equal(expression.describe(), "1 m/s");
        assert.equal(expression.invoke().toString(), "1 m/s");
    });

    it("convert a speed: (1 m/s) km/h", () => {
        let expression = Parser.parseExpression(Parser.scan("(1 m/s) km/h"));

        assert.equal(expression.describe(), "(1 m/s) km/h");
        assert.equal(expression.invoke().toString(), "3.6 km/h");
    });

});
