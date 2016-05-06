/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Basic)", () => {

    testScript("42.1", "42.1");
    testScript("\"a string\"", "a string");
    testScript("\"a ${2}nd string\"", "a 2nd string");

});
