/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Basic)", () => {

    Utils.testExpression("42.1", "42.1");
    Utils.testExpression("\"a string\"", "a string");
    Utils.testExpression("\"a ${2}nd string\"", "a 2nd string");

});
