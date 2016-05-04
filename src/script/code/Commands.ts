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
                    value: valueArg,
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
                    left: leftArg,
                    right: rightArg
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
            return procedure.invoke(scope, arg);
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
        super(line, column, (scope) => {
            let values: any[] = [];
            let segment = segments.shift();
            let value = segment.invoke(scope);

            while (true) {
                if (value instanceof Identifier) {
                    let variable = scope.required(value.name);

                    if (value instanceof Definition) {
                        if (!segments.length) {
                            throw new Error(Utils.formatError(segment.line, segment.column,
                                `Parameters are missing: ${(value as Definition).name}`));
                        }

                        segment = segments.shift();

                        let parameter = segment.invoke(scope);

                        value = (value as Definition).invoke(parameter);
                    }
                    // TODO implement variable access
                    else {
                        throw new Error(Utils.formatError(segment.line, segment.column,
                            `Undefined reference: ${value.name}`));
                    }

                    continue;
                }

                values.push(value);

                if (!segments.length) {
                    break;
                }

                segment = segments.shift();
                value = segment.invoke(scope);
            }

            return scope.invoke("chain", {
                values: values
            });
        }, () => segments.map((segment) => segment.describe()).join(" "));
    }

    toString(): string {
        return `Chain(${this.segments.join(", ")})`;
    }
}

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
    constructor(line: number, column: number, private commands: Command[], private lazy: boolean = false) {
        super(line, column,
            (scope) => {
                if (commands.length === 0) {
                    return null; // FIXME what is an empty Tuple? NULL, NIL, EMPTY, (), [], ... ?
                }

                if (commands.length === 1) {
                    return commands[0].invoke(scope);
                }

                return new List(scope, commands, lazy);
            },
            () => `(${commands.map((item) => item.describe()).join(", ")})`);
    }

    toString(): string {
        return `ATuple(${this.commands})`;
    }
}

export class AList extends Command {
    constructor(line: number, column: number, private commands: Command[], private lazy: boolean = false) {
        super(line, column,
            (scope) => {
                return new List(scope, commands, lazy);
            },
            () => `[${commands.map((item) => item.describe()).join(", ")}]`);
    }

    toString(): string {
        return `AList(${this.commands})`;
    }
}

export class AMap extends Command {
    constructor(line: number, column: number, private commands: {
        key: Command;
        value: Command;
    }[], lazy: boolean = false) {
        super(line, column,
            (scope) => {
                let map: { [name: string]: any } = {};

                for (let command of commands) {
                    let key = command.key.invoke(scope);

                    if ((key === undefined) || (key === null)) {
                        throw new Error(Utils.formatError(command.key.line, command.key.column,
                            `Invalid key: ${key}`));
                    }

                    map[key] = command.value.invoke(scope);
                }

                return new Map(scope, map, lazy);
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
                    value: valueArg,
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
                    values: segments
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
    constructor(line: number, column: number, private argument: Command) {
        super(line, column,
            (scope) => argument.invoke(scope),
            () => `\${${argument.describe()}}`);
    }

    toString(): string {
        return `StringPlaceholderSegment(${this.argument})`;
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

