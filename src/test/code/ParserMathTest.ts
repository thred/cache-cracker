/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Math)", () => {

    Utils.testExpression("+2", "2");
    Utils.testExpression("-2", "-2");

    Utils.testExpression("1 + 2", "3");
    Utils.testExpression("3 - 2", "1");

    Utils.testExpression("2 * 3", "6");
    Utils.testExpression("6 / 3", "2");

    Utils.testExpression("4 ^ 3 ^ 2", "262144");

    Utils.testExpression("3 mod 2", "1");

    Utils.testExpression("2 * 3 + 4 / 2", "8");
    Utils.testExpression("2 * (3 + 4) / 2", "7");

});
