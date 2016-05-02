import {Command} from "./Command";
import {Definition} from "./Definition";
import {Identifier} from "./Identifier";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

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

export class Parentheses extends Command {
    constructor(line: number, column: number, private arg: Command) {
        super(line, column,
            (scope) => arg.invoke(scope),
            () => `(${arg.describe()})`);
    }

    toString(): string {
        return `Parentheses(${this.arg})`;
    }
}

export class Constant extends Command {
    constructor(line: number, column: number, private value: any) {
        super(line, column,
            (scope) => value,
            () => `${value}`);
    }

    toString(): string {
        return `Constant(${this.value})`;
    }
}

export class List extends Command {
    constructor(line: number, column: number, private commands: Command[]) {
        super(line, column,
            (scope) => {
                let list: any[] = [];

                for (let command of commands) {
                    list.push(command.invoke(scope));
                }

                return list;
            },
            () => `[${commands.map((item) => item.describe()).join(", ")}]`);
    }

    toString(): string {
        return `List(${this.commands})`;
    }
}

export class Map extends Command {
    constructor(line: number, column: number, private commands: {
        key: Command;
        value: Command;
    }[]) {
        super(line, column,
            (scope) => {
                let map: any[] = [];

                for (let command of commands) {
                    let key = command.key.invoke(scope);

                    if ((key === undefined) || (key === null)) {
                        throw new Error(Utils.formatError(command.key.line, command.key.column,
                            `Invalid key: ${key}`));
                    }

                    map[key.toString()] = command.value.invoke(scope);
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
        return `List(${this.commands})`;
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

