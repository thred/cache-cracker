/// <reference path="../imports.d.ts" />

import * as CodeTestUtils from "./CodeTestUtils";

describe("Parser (Quantity of Speed)", () => {

    CodeTestUtils.testStatement("1.5 m/s", "1.5 m/s");
    CodeTestUtils.testStatement("(5.4 km/h) m/s", "1.5 m/s");

});
