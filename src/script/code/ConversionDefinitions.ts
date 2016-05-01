import * as Code from "./Code";
import {Context} from "./Context";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import * as Utils from "./Utils";

Code.registerDefinition({
    name: "asString",
    description: "Converts the value to a string.",
    parameters: {
        value: "The value"
    },
    operation: (scope: Scope) => {
        let value = scope.required("value");
        
        if (value === null) {
            return null;
        }
        
        return value.toString();
    }
});

Code.registerDefinition({
    name: "asQuantity",
    description: "Converts the value to a quantity.",
    parameters: {
        value: "The value"
    },
    operation: (scope: Scope) => {
        let value = scope.required("value");

        if (value === null) {
            return null;
        }
        
        if (value instanceof Quantity) {
            return value as Quantity;
        }

        if (typeof value === "number") {
            return new Quantity(value);
        }

        if (typeof value === "string") {
            return Quantity.parse(scope.requiredAsString("language"), value as string);
        }

        throw new Error(`Convert to Quantity failed: ${value}`);
    }
});