import {Command} from "./Command";
import {Definition} from "./Definition";
import {Identifier} from "./Identifier";
import {List} from "./List";
import {Map} from "./Map";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Definitions from "./Definitions";
import * as Utils from "./Utils";

// export class DefinitionInvocation extends Command {
//     constructor(line: number, column: number, private name: string, private args?: { [name: string]: Command }) {
//         super(line, column,
//             (scope) => {
//                 scope.invoke(name, args);
//                 let definition = scope.requiredAsDefinition(name);

//                 return definition.invoke(scope.derive(args));
//             }, () => {
//                 return `${name}(${Utils.describe(args)})`;
//             }
//         );
//     }

//     toString(): string {
//         return `DefinitionInvocation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe(this.args)})`;
//     }
// }

export class UnaryOperation extends Command {
    constructor(line: number, column: number, private name: string, private symbol: string, private valueArg: Command) {
        super(line, column,
            (scope) => {
                return scope.invoke(name, {
                    value: valueArg.invoke(scope),
                });
            }, () => `${symbol}${valueArg.describe()}`);
    }

    toString(): string {
        return `UnaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            value: this.valueArg
        })})`;
    }
}

export class BinaryOperation extends Command {
    constructor(line: number, column: number, private name: string, private symbol: string, private leftArg: Command, private rightArg: Command) {
        super(line, column,
            (scope) => {
                return scope.invoke(name, {
                    left: leftArg.invoke(scope),
                    right: rightArg.invoke(scope)
                });
            }, () => `${leftArg.describe()} ${symbol} ${rightArg.describe()}`);
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

export class Call extends Command {
    constructor(line: number, column: number, procedure: Definitions.Procedure, arg: Command) {
        super(line, column, (scope) => {
            let params = procedure.params;
            let values = arg.invoke(scope);
            let valuesAsMap: Map;

            if (values instanceof Map) {
                valuesAsMap = values as Map;
            }
            else if (values instanceof List) {
                if (values.length > params.length) {
                    throw new Error(Utils.formatError(line, column,
                        `Too many arguments. Procedure only has ${params.length} parameters, not ${values.length} as specified: ${procedure.describe()}`));
                }

                valuesAsMap = new Map();

                for (let index = 0; index < values.length; index++) {
                    valuesAsMap.set(params[index].name, values.get(index, true));
                }
            }
            else {
                if (params.length <= 0) {
                    throw new Error(Utils.formatError(line, column,
                        `Too many arguments. Procedure does not define any parameters: ${procedure.describe()}`));
                }

                valuesAsMap = new Map();
                valuesAsMap.set(params[0].name, values);
            }

            let args: { [name: string]: any } = {};

            for (let param of params) {
                let name = param.name;
                let value = valuesAsMap.get(name);

                if (value === undefined) {
                    value = param.fallback;

                    if (value === undefined) {
                        throw new Error(Utils.formatError(line, column,
                            `Required parameter "${name}" is missing in procedure call: ${procedure.describe()}`));
                    }
                }

                args[name] = value;
            }

            return scope.invoke(procedure.name, args);
        }, () => `${name} ${arg.describe()}`);
    };
}

export class Access extends Command {
    constructor(line: number, column: number, name: string) {
        super(line, column, (scope) => {

            throw new Error("Implement me!");

        }, () => `${name}`);
    };
}

export class Chain extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column,
            (scope) => {
                return scope.invoke("chain", {
                    values: new List(segments.map((segment) => segment.invoke(scope)))
                });
            }, () => `${segments.map((segment) => segment.describe()).join(" ")}`);
    }

    toString(): string {
        return `Chain(${this.segments})`;
    }
}


// export class Chain extends Command {
//     constructor(line: number, column: number, private segments: Command[]) {
//         super(line, column, (scope) => {
//             let values: any[] = [];

//             for (let segment of segments) {
//                 values.push(segment.invoke(scope));
//             }


//             let index = 0;

//             while (true) {
//                 if ((index))    
//             }



//             let values: any[] = [];
//             let segment = segments.shift();
//             let value = segment.invoke(scope);

//             while (true) {


//                 if (value instanceof Identifier) {
//                     let variable = scope.required(value.name);

//                     if (value instanceof Definition) {
//                         if (!segments.length) {
//                             throw new Error(Utils.formatError(segment.line, segment.column,
//                                 `Parameters are missing: ${(value as Definition).name}`));
//                         }

//                         segment = segments.shift();

//                         let parameter = segment.invoke(scope);

//                         value = (value as Definition).invoke(parameter);
//                     }
//                     // TODO implement variable access
//                     else {
//                         throw new Error(Utils.formatError(segment.line, segment.column,
//                             `Undefined reference: ${value.name}`));
//                     }

//                     continue;
//                 }

//                 values.push(value);

//                 if (!segments.length) {
//                     break;
//                 }

//                 segment = segments.shift();
//                 value = segment.invoke(scope);
//             }

//             return scope.invoke("chain", {
//                 values: values
//             });

//             return null;
//         }, () => segments.map((segment) => segment.describe()).join(" "));
//     }

//     toString(): string {
//         return `Chain(${this.segments.join(", ")})`;
//     }
// }

export class AValue extends Command {
    constructor(line: number, column: number, private value: any) {
        super(line, column,
            (scope) => value,
            () => `${value}`);
    }

    toString(): string {
        return `AValue(${this.value})`;
    }
}

export class ATuple extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                if (commands.length === 0) {
                    return null; // FIXME what is an empty Tuple? NULL, NIL, EMPTY, (), [], ... ?
                }

                if (commands.length === 1) {
                    return commands[0].invoke(scope);
                }

                return commands.map((command => command.invoke(scope)));
            },
            () => `(${commands.map((command) => command.describe()).join(", ")})`);
    }

    toString(): string {
        return `ATuple(${this.commands})`;
    }
}

export class AList extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                return commands.map((command => command.invoke(scope)));
            },
            () => `[${commands.map((command) => command.describe()).join(", ")}]`);
    }

    toString(): string {
        return `AList(${this.commands})`;
    }
}

export class AMap extends Command {
    constructor(line: number, column: number, private commands: {
        key: Command;
        value: Command;
    }[]) {
        super(line, column,
            (scope) => {
                let map = new Map();

                for (let command of commands) {
                    let key = command.key.invoke(scope);

                    if ((key === undefined) || (key === null)) {
                        throw new Error(Utils.formatError(command.key.line, command.key.column,
                            `Invalid key: ${key}`));
                    }

                    map.set(key, command.value.invoke(scope));
                }

                return map;
            },
            () => {
                if (!this.commands.length) {
                    return "{}";
                }

                let description = "{";

                for (let command of commands) {
                    description += "\n\t" + Utils.indent(command.key.describe()) + ": " + Utils.indent(command.value.describe());
                }

                description += "\n}";

                return description;
            });
    }

    toString(): string {
        return `AMap(${this.commands})`;
    }
}

export class AUnit extends Command {
    constructor(line: number, column: number, private unit: Unit) {
        super(line, column,
            (scope) => unit,
            () => `${unit.symbols[0]}`);
    }

    toString(): string {
        return `AUnit(${this.unit.symbols[0]})`;
    }
}


export class InUnit extends Command {
    constructor(line: number, column: number, private valueArg: Command, private unit: Unit) {
        super(line, column,
            (scope) => {
                return scope.invoke("convert", {
                    value: valueArg.invoke(scope),
                    unit: unit
                });
            }, () => `${valueArg.describe()} ${unit.symbols[0]}`);
    }

    toString(): string {
        return `InUnit(${this.valueArg}, ${this.unit.symbols[0]})`;
    }
}

export class StringChain extends Command {
    constructor(line: number, column: number, private segments: Command[]) {
        super(line, column,
            (scope) => {
                return scope.invoke("concat", {
                    values: new List(segments.map((segment) => segment.invoke(scope)))
                });
            },
            () => `"${segments.map((segment) => segment.describe()).join("")}"`);
    }

    toString(): string {
        return `StringChain(${this.segments})`;
    }
}

export class StringReferenceSegment extends Command {
    constructor(line: number, column: number, private name: string) {
        super(line, column,
            (scope) => scope.get(name),
            () => `$${name}`);
    }

    toString(): string {
        return `StringReferenceSegment(${this.name})`;
    }
}

export class StringPlaceholderSegment extends Command {
    constructor(line: number, column: number, private arg: Command) {
        super(line, column,
            (scope) => arg.invoke(scope),
            () => `\${${arg.describe()}}`);
    }

    toString(): string {
        return `StringPlaceholderSegment(${this.arg})`;
    }
}

export class StringStringSegment extends Command {
    constructor(line: number, column: number, private s: string) {
        super(line, column,
            (scope) => s,
            () => Utils.toEscapedString(s));
    }

    toString(): string {
        return `StringStringSegment(${this.s})`;
    }
}

