/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Sample)", () => {

    testScript("1 m² 5000 cm²", "1.5 m²");

});
