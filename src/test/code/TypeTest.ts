/// <reference path="../imports.d.ts" />

import {Procedure} from "../../script/code/Procedure";
import {Quantity} from "../../script/code/Quantity";
import {Type, Types} from "../../script/code/Type";
import {Unit} from "../../script/code/Unit";

import {assert} from "chai";

export function testOf(value: any, typeOrString: Type | string): void {
    it(`${value} is ${(typeOrString instanceof Type) ? typeOrString.describe() : typeOrString}`, () => {
        let type = Type.parse(typeOrString);
        let detectedType = Type.of(value);

        assert.deepEqual(detectedType, type);
    });
}

export function testAccept(left: string, right: string, accept: boolean): void {
    it(`${left} is ${accept ? "" : "not "}accepting ${right}`, () => {
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

    testOf([Quantity.of(1), Quantity.of(2), Quantity.of(3)], "List<?>");
    testOf(["one", "two", "three"], "List<?>");


    testOf({ one: 1, two: 2, three: 3 }, Types.MAP);
    // testOf(new Procedure())

    testAccept("Quantity", "Quantity", true);
    testAccept("Quantity", "Text", false);
    testAccept("Quantity", "Type", false);
    testAccept("Quantity", "Unit", false);
    testAccept("Quantity", "?", false);

    testAccept("Text", "Quantity", false);
    testAccept("Text", "Text", true);
    testAccept("Text", "Type", false);
    testAccept("Text", "Unit", false);
    testAccept("Text", "?", false);

    testAccept("Type", "Quantity", false);
    testAccept("Type", "Text", false);
    testAccept("Type", "Type", true);
    testAccept("Type", "Unit", false);
    testAccept("Type", "?", false);

    testAccept("Unit", "Quantity", false);
    testAccept("Unit", "Text", false);
    testAccept("Unit", "Type", false);
    testAccept("Unit", "Unit", true);
    testAccept("Unit", "?", false);

    testAccept("?", "Quantity", true);
    testAccept("?", "Text", true);
    testAccept("?", "Type", true);
    testAccept("?", "Unit", true);
    testAccept("?", "?", true);

})

// export function testQuantityParser(language: string, s: string, result: string): void {
//     it(`${s} (${language}) => ${result}`, () => {
//         let quantity = Quantity.parse(language, s);

//         assert.equal(quantity.toString(), result);
//     });
// }

// describe("Quantity Parser", () => {

//     testQuantityParser("en-US", "1.5 m", "1.5 m");
//     testQuantityParser("en-US", "1 m 50 cm", "1.5 m");
//     testQuantityParser("en-US", "1 m 50", "1.5 m");
//     testQuantityParser("en-US", "1 500 cm", "1500 cm");

// });
