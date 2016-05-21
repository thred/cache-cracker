/// <reference path="../imports.d.ts" />

import * as Test from "./Test";

describe("Parser (DefaultModule)", () => {

    Test.script("true", "true");
    Test.script("false", "false");
    Test.script("yes", "true");
    Test.script("no", "false");

    Test.script("List", "List");
    Test.script("LogicalValue", "LogicalValue");
    Test.script("Map", "Map");
    Test.script("Procedure", "Procedure");
    Test.script("Quantity", "Quantity");
    Test.script("Text", "Text");
    Test.script("Type", "Type");
    Test.script("Unit", "Unit");

});
