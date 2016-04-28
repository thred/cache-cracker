/// <reference path="../imports.d.ts" />

import * as Utils from "./Utils";

describe("Parser (Quantity of Speed)", () => {

    Utils.testExpression("1.5 m/s", "1.5 m/s");
    Utils.testExpression("(5.4 km/h) m/s", "1.5 m/s");

});
