/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Sample)", () => {

    Utils.testExpression("0.5 m² / 50 cm", "1 m");
    Utils.testExpression("2 m ^ 3", "8 m³");

});
