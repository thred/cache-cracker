import {Expression} from "./Expression";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";

import * as Operations from "./Operations";
import * as Utils from "./Utils";

export class DefinitionInvocation extends Expression {
    constructor(line: number, column: number, private name: string, private args?: { [name: string]: Expression }) {
        super(line, column,
            (scope) => {
                let definition = scope.requiredAsDefinition(name);

                return definition.fn(scope.derive(args));
            }, () => {
                return `${name}(${Utils.describe(args)})`;
            }
        );
    }

    toString(): string {
        return `DefinitionInvocation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe(this.args)})`;
    }
}


export class BinaryOperation extends Expression {
    constructor(line: number, column: number, private name: string, private symbol: string, private leftArg: Expression, private rightArg: Expression) {
        super(line, column,
            (scope) => {
                let definition = scope.requiredAsDefinition(name);

                return definition.fn(scope.derive({
                    left: leftArg,
                    right: rightArg
                }));
            }, () => `${leftArg.describe()} ${symbol} ${rightArg.describe()}`);
    }

    toString(): string {
        return `BinaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

export class UnaryOperation extends Expression {
    constructor(line: number, column: number, private name: string, private symbol: string, private valueArg: Expression) {
        super(line, column,
            (scope) => {
                let definition = scope.requiredAsDefinition(name);

                return definition.fn(scope.derive({
                    value: valueArg,
                }));
            }, () => `${symbol}${valueArg.describe()}`);
    }

    toString(): string {
        return `UnaryOperation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            value: this.valueArg
        })})`;
    }
}

export class InUnit extends Expression {
    constructor(line: number, column: number, private valueArg: Expression, private unit: Unit) {
        super(line, column,
            (scope) => {
                let definition = scope.requiredAsDefinition("convert");

                return definition.fn(scope.derive({
                    value: valueArg,
                    unit: unit
                }));
            }, () => `${valueArg.describe()} ${unit.symbols[0]}`);
    }

    toString(): string {
        return `InUnit(${this.valueArg}, ${this.unit.symbols[0]})`;
    }
}

export class Parentheses extends Expression {
    constructor(line: number, column: number, private arg: Expression) {
        super(line, column,
            (scope) => arg.invoke(scope),
            () => `(${arg.describe()})`);
    }

    toString(): string {
        return `Parentheses(${this.arg})`;
    }
}

export class Constant extends Expression {
    constructor(line: number, column: number, private value: any) {
        super(line, column,
            (scope) => value,
            () => `${value}`);
    }

    toString(): string {
        return `Constant(${this.value})`;
    }
}

export class Chain extends Expression {
    constructor(line: number, column: number, private leftArg: Expression, private rightArg: Expression) {
        super(line, column, (scope) => {
            let definition = scope.requiredAsDefinition("chain");

            return definition.fn(scope.derive({
                left: leftArg,
                right: rightArg
            }));
        }, () => `${leftArg.describe()} ${rightArg.describe()}`);
    }

    toString(): string {
        return `Chain(${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

export class StringChain extends Expression {
    constructor(line: number, column: number, private segments: Expression[]) {
        super(line, column,
            (scope) => {
                return Operations.concat(segments.map((segment) => segment.invoke(scope)));
            },
            () => `"${segments.map((segment) => segment.describe()).join("")}"`);
    }

    toString(): string {
        return `StringChain(${this.segments})`;
    }
}

export class StringReferenceSegment extends Expression {
    constructor(line: number, column: number, private name: string) {
        super(line, column,
            (scope) => scope.get(name),
            () => `$${name}`);
    }

    toString(): string {
        return `StringReferenceSegment(${this.name})`;
    }
}

export class StringPlaceholderSegment extends Expression {
    constructor(line: number, column: number, private argument: Expression) {
        super(line, column,
            (scope) => argument.invoke(scope),
            () => `\${${argument.describe()}}`);
    }

    toString(): string {
        return `StringPlaceholderSegment(${this.argument})`;
    }
}

export class StringStringSegment extends Expression {
    constructor(line: number, column: number, private s: string) {
        super(line, column,
            (scope) => s,
            () => Utils.toEscapedString(s));
    }

    toString(): string {
        return `StringStringSegment(${this.s})`;
    }
}

