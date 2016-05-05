/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Math)", () => {

    CodeTestUtils.testStatement("+2", "2");
    CodeTestUtils.testStatement("-2", "-2");

    CodeTestUtils.testStatement("1 + 2", "3");
    CodeTestUtils.testStatement("3 - 2", "1");

    CodeTestUtils.testStatement("2 * 3", "6");
    CodeTestUtils.testStatement("6 / 3", "2");

    CodeTestUtils.testStatement("4 ^ 3 ^ 2", "262144");

    CodeTestUtils.testStatement("3 mod 2", "1");

    CodeTestUtils.testStatement("2 * 3 + 4 / 2", "8");
    CodeTestUtils.testStatement("2 * (3 + 4) / 2", "7");

});
