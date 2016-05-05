/// <reference path="../imports.d.ts" />

import {testScript} from "./CodeTestUtils";

describe("Parser (Quantity of Speed)", () => {

    testScript("1.5 m/s", "1.5 m/s");
    testScript("(5.4 km/h) m/s", "1.5 m/s");

});
