/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Sample)", () => {

    CodeTestUtils.testExpression("0.5 m² / 50 cm", "1 m");
    CodeTestUtils.testExpression("2 m ^ 3", "8 m³");

});
