/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Sample)", () => {

     testScript("\"a ${2}nd string\"", "a 2nd string");
    // testScript("language", "en-US");


});
