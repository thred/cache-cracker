/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Math)", () => {

    CodeTestUtils.testExpression("+2", "2");
    CodeTestUtils.testExpression("-2", "-2");

    CodeTestUtils.testExpression("1 + 2", "3");
    CodeTestUtils.testExpression("3 - 2", "1");

    CodeTestUtils.testExpression("2 * 3", "6");
    CodeTestUtils.testExpression("6 / 3", "2");

    CodeTestUtils.testExpression("4 ^ 3 ^ 2", "262144");

    CodeTestUtils.testExpression("3 mod 2", "1");

    CodeTestUtils.testExpression("2 * 3 + 4 / 2", "8");
    CodeTestUtils.testExpression("2 * (3 + 4) / 2", "7");

});
