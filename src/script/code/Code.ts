import {Definition} from "./Definition";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Conversions from "./Conversions";
import * as Math from "./Math";
import * as Strings from "./Strings";

export let global: Scope = new Scope(null);

global.set("language", "en-US");

export function populate(scope: Scope) {

    scope.register(new Definition("chain", "Chains the values (e.g. 4 ft 2 in).", {
        values: "A list of values",
    }, (scope: Scope) => {
        let values: any[] = scope.requiredAsList("values");
        
        // while (values.length) {
        //     let value = values.shift();
            
        //     if ()
            
            
            
        // }

        // if (left instanceof Quantity) {
        //     if (right instanceof Quantity) {
        //         return (left as Quantity).chain(right as Quantity);
        //     }

        //     if (right instanceof Unit) {
        //         return (left as Quantity).convert(right as Unit);
        //     }

        //     if (typeof right === "string") {
        //         return (left as Quantity).chain(scope.requiredAsQuantity(right));
        //     }


        // }



        // return .chain(scope.requiredAsQuantity("right"));
        return null;
    }));



}


Conversions.populate(global);
Math.populate(global);
Strings.populate(global);


