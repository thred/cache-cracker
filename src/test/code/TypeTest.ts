/// <reference path="../imports.d.ts" />

import {Definition} from "../../script/code/Definition";
import {Procedure} from "../../script/code/Procedure";
import {Quantity} from "../../script/code/Quantity";
import {Type, Types} from "../../script/code/Type";
import {Unit} from "../../script/code/Unit";

import * as Units from "../../script/code/Units";
import * as Utils from "../../script/code/Utils";

import {assert} from "chai";

export function testOf(value: any, typeOrString: Type | string): void {
    it(`${Utils.indent(Utils.describe(value), "      ")} is ${Utils.indent(Utils.describe(typeOrString), "      ")}`, () => {
        let type = Type.parse(typeOrString);
        let detectedType = Type.of(value);

        assert.deepEqual(detectedType, type);
    });
}

export function testAccept(left: string, right: string, accept: boolean): void {
    it(`${Utils.indent(left, "      ")} is ${accept ? "" : "not "}accepting ${Utils.indent(right, "      ")}`, () => {
        let leftType = Type.parse(left);

        assert.equal(leftType.describe(), left);

        let rightType = Type.parse(right);

        assert.equal(rightType.describe(), right);

        assert.equal(leftType.accepts(rightType), accept);
    });
}

describe("Type", () => {

    testOf(null, Types.VOID);
    testOf(null, "Void");

    testOf(true, Types.BOOL);
    testOf(true, "Bool");
    testOf(false, "Bool");

    testOf(["one", "two", "three"], Types.LIST);
    testOf([Quantity.of(1), Quantity.of(2), Quantity.of(3)], "List<?>");
    testOf(["one", "two", "three"], "List<?>");

    testOf({ one: Quantity.of(1), two: Quantity.of(2), three: Quantity.of(3) }, Types.MAP);
    testOf({ one: Quantity.of(1), two: Quantity.of(2), three: Quantity.of(3) }, "Map<?>");

    testOf(new Procedure(null, [], Definition.bool("bool", ""), () => null), "Procedure<Bool>");
    testOf(new Procedure(null, [], Definition.list("list", ""), () => null), "Procedure<List<?>>");
    testOf(new Procedure(null, [], Definition.map("map", ""), () => null), "Procedure<Map<?>>");
    testOf(new Procedure(null, [], Definition.procedure("procedure", "", [], Definition.bool("bool", ""), () => null), () => null), "Procedure<Procedure<Bool>>");
    testOf(new Procedure(null, [], Definition.quantity("value", ""), () => null), "Procedure<Quantity>");
    testOf(new Procedure(null, [], Definition.text("value", ""), () => null), "Procedure<Text>");
    testOf(new Procedure(null, [], Definition.type("value", ""), () => null), "Procedure<Type>");
    testOf(new Procedure(null, [], Definition.unit("value", ""), () => null), "Procedure<Unit>");

    testOf(Quantity.of(1), Types.QUANTITY);
    testOf(Quantity.of(2), "Quantity");

    testOf("one", Types.TEXT);
    testOf("two", "Text");

    testOf(Types.QUANTITY, Types.TYPE);
    testOf(Types.TEXT, "Type");

    testOf(Units.METER, Types.UNIT);
    testOf(Units.QUBIC_METER, "Unit");

    testAccept("Void", "Void", true);
    testAccept("Void", "Bool", false);
    testAccept("Void", "List<?>", false);
    testAccept("Void", "Map<?>", false);
    testAccept("Void", "Procedure<?>", false);
    testAccept("Void", "Quantity", false);
    testAccept("Void", "Text", false);
    testAccept("Void", "Type", false);
    testAccept("Void", "Unit", false);
    testAccept("Void", "?", false);

    testAccept("Bool", "Void", true);
    testAccept("Bool", "Bool", true);
    testAccept("Bool", "List<?>", false);
    testAccept("Bool", "Map<?>", false);
    testAccept("Bool", "Procedure<?>", false);
    testAccept("Bool", "Quantity", false);
    testAccept("Bool", "Text", false);
    testAccept("Bool", "Type", false);
    testAccept("Bool", "Unit", false);
    testAccept("Bool", "?", false);

    testAccept("List<?>", "Void", true);
    testAccept("List<?>", "Bool", false);
    testAccept("List<?>", "List<?>", true);
    testAccept("List<?>", "Map<?>", false);
    testAccept("List<?>", "Procedure<?>", false);
    testAccept("List<?>", "Quantity", false);
    testAccept("List<?>", "Text", false);
    testAccept("List<?>", "Type", false);
    testAccept("List<?>", "Unit", false);
    testAccept("List<?>", "?", false);

    testAccept("Map<?>", "Void", true);
    testAccept("Map<?>", "Bool", false);
    testAccept("Map<?>", "List<?>", false);
    testAccept("Map<?>", "Map<?>", true);
    testAccept("Map<?>", "Procedure<?>", false);
    testAccept("Map<?>", "Quantity", false);
    testAccept("Map<?>", "Text", false);
    testAccept("Map<?>", "Type", false);
    testAccept("Map<?>", "Unit", false);
    testAccept("Map<?>", "?", false);

    testAccept("Procedure<?>", "Void", true);
    testAccept("Procedure<?>", "Bool", false);
    testAccept("Procedure<?>", "List<?>", false);
    testAccept("Procedure<?>", "Map<?>", false);
    testAccept("Procedure<?>", "Procedure<?>", true);
    testAccept("Procedure<?>", "Quantity", false);
    testAccept("Procedure<?>", "Text", false);
    testAccept("Procedure<?>", "Type", false);
    testAccept("Procedure<?>", "Unit", false);
    testAccept("Procedure<?>", "?", false);

    testAccept("Quantity", "Void", true);
    testAccept("Quantity", "Bool", false);
    testAccept("Quantity", "List<?>", false);
    testAccept("Quantity", "Map<?>", false);
    testAccept("Quantity", "Procedure<?>", false);
    testAccept("Quantity", "Quantity", true);
    testAccept("Quantity", "Text", false);
    testAccept("Quantity", "Type", false);
    testAccept("Quantity", "Unit", false);
    testAccept("Quantity", "?", false);

    testAccept("Text", "Void", true);
    testAccept("Text", "Bool", false);
    testAccept("Text", "List<?>", false);
    testAccept("Text", "Map<?>", false);
    testAccept("Text", "Procedure<?>", false);
    testAccept("Text", "Quantity", false);
    testAccept("Text", "Text", true);
    testAccept("Text", "Type", false);
    testAccept("Text", "Unit", false);
    testAccept("Text", "?", false);

    testAccept("Type", "Void", true);
    testAccept("Type", "Bool", false);
    testAccept("Type", "List<?>", false);
    testAccept("Type", "Map<?>", false);
    testAccept("Type", "Procedure<?>", false);
    testAccept("Type", "Quantity", false);
    testAccept("Type", "Text", false);
    testAccept("Type", "Type", true);
    testAccept("Type", "Unit", false);
    testAccept("Type", "?", false);

    testAccept("Unit", "Void", true);
    testAccept("Unit", "Bool", false);
    testAccept("Unit", "List<?>", false);
    testAccept("Unit", "Map<?>", false);
    testAccept("Unit", "Procedure<?>", false);
    testAccept("Unit", "Quantity", false);
    testAccept("Unit", "Text", false);
    testAccept("Unit", "Type", false);
    testAccept("Unit", "Unit", true);
    testAccept("Unit", "?", false);

    testAccept("?", "Void", true);
    testAccept("?", "Bool", true);
    testAccept("?", "List<?>", true);
    testAccept("?", "Map<?>", true);
    testAccept("?", "Procedure<?>", true);
    testAccept("?", "Quantity", true);
    testAccept("?", "Text", true);
    testAccept("?", "Type", true);
    testAccept("?", "Unit", true);
    testAccept("?", "?", true);
});
