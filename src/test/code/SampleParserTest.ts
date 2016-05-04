/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Sample)", () => {

    CodeTestUtils.testStatement("0.5 m² / 50 cm", "1 m");
    CodeTestUtils.testStatement("2 m ^ 3", "8 m³");

});
