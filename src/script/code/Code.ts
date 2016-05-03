import {Command} from "./Command";
import {Context} from "./Context";
import {Definition} from "./Definition";
import {Parser} from "./Parser";
import {Quantity} from "./Quantity";
import {Scanner} from "./Scanner";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Conversions from "./Conversions";
import * as Math from "./Math";
import * as Strings from "./Strings";

export let global: Context = new Context(null);

export function scan(source: string | Scanner): Scanner {
    return (typeof source === "string") ? new Scanner(source) : source;
}

export function parse(source: string | Scanner): Command {
    return new Parser(scan(source)).parseStatement(global.derive());
}

export function populate(context: Context) {

    context.defineVariable("language", "The default language.", "en-US");

    // context.defineProcedure("chain", "Chains the values (e.g. 4 ft 2 in).", {
    //     "values": "A list of values",
    // }, (scope: Scope) => {
    //     let values: any[] = scope.requiredAsList("values");

    //     // while (values.length) {
    //     //     let value = values.shift();

    //     //     if ()



    //     // }

    //     // if (left instanceof Quantity) {
    //     //     if (right instanceof Quantity) {
    //     //         return (left as Quantity).chain(right as Quantity);
    //     //     }

    //     //     if (right instanceof Unit) {
    //     //         return (left as Quantity).convert(right as Unit);
    //     //     }

    //     //     if (typeof right === "string") {
    //     //         return (left as Quantity).chain(scope.requiredAsQuantity(right));
    //     //     }


    //     // }



    //     // return .chain(scope.requiredAsQuantity("right"));
    //     return null;
    // });

    Conversions.populate(global);
    Math.populate(global);
    Strings.populate(global);
}




