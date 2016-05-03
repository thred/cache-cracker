/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Basic)", () => {

    CodeTestUtils.testExpression("42.1", "42.1");
    CodeTestUtils.testExpression("\"a string\"", "a string");
    CodeTestUtils.testExpression("\"a ${2}nd string\"", "a 2nd string");

});
