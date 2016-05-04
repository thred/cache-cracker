/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Basic)", () => {

    CodeTestUtils.testStatement("42.1", "42.1");
    CodeTestUtils.testStatement("\"a string\"", "a string");
    CodeTestUtils.testStatement("\"a ${2}nd string\"", "a 2nd string");

});
