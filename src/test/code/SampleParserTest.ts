/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Sample)", () => {

    CodeTestUtils.testStatement("1 m² 5000 cm²", "1.5 m²");

});
