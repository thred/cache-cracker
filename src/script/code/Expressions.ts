import {Expression} from "./Expression";
import * as Operations from "./Operations";
import {Quantity} from "./Quantity";
import {Scope} from "./Scope";
import {Unit} from "./Unit";
import * as Utils from "./Utils";

export class InvokeExpression extends Expression {
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
        return `Invoke(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe(this.args)})`;
    }
}


export class OperationExpression extends Expression {
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
        return `Operation(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            left: this.leftArg,
            right: this.rightArg
        })})`;
    }
}

export class UnaryExpression extends Expression {
    constructor(line: number, column: number, private name: string, private symbol: string, private arg: Expression) {
        super(line, column,
            (scope) => {
                let definition = scope.requiredAsDefinition(name);

                return definition.fn(scope.derive({
                    value: arg,
                }));
            }, () => `${symbol}${arg.describe()}`);
    }

    toString(): string {
        return `Unary(${Utils.toEscapedStringWithQuotes(this.name)}, ${Utils.describe({
            value: this.arg
        })})`;
    }
}

export class UnitExpression extends Expression {
    constructor(line: number, column: number, private unit: Unit, private argument: Expression) {
        super(line, column,
            (scope) => Operations.convert(argument.invoke(scope), unit),
            () => `${argument.describe()} ${unit.symbols[0]}`);
    }

    toString(): string {
        return `Unit(${this.unit}, ${this.argument})`;
    }
}

export class ParenthesesExpression extends Expression {
    constructor(line: number, column: number, private argument: Expression) {
        super(line, column,
            (scope) => argument.invoke(scope),
            () => `(${argument.describe()})`);
    }

    toString(): string {
        return `Parentheses(${this.argument})`;
    }
}

export class QuantityExpression extends Expression {
    constructor(line: number, column: number, private quantity: Quantity) {
        super(line, column,
            (scope) => quantity,
            () => `${quantity}`);
    }

    toString(): string {
        return `Quantity(${this.quantity})`;
    }
}

export class ChainExpression extends Expression {
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

export class StringExpression extends Expression {
    constructor(line: number, column: number, private segments: Expression[]) {
        super(line, column,
            (scope) => {
                return Operations.concat(segments.map((segment) => segment.invoke(scope)));
            },
            () => `"${segments.map((segment) => segment.describe()).join("")}"`);
    }

    toString(): string {
        return `String(${this.segments})`;
    }
}

export class ReferenceExpression extends Expression {
    constructor(line: number, column: number, private name: string) {
        super(line, column,
            (scope) => scope.get(name),
            () => `$${name} `);
    }

    toString(): string {
        return `Reference(${this.name})`;
    }
}

export class PlaceholderExpression extends Expression {
    constructor(line: number, column: number, private argument: Expression) {
        super(line, column,
            (scope) => argument.invoke(scope),
            () => `\${${argument.describe()}}`);
    }

    toString(): string {
        return `Placeholder(${this.argument})`;
    }
}

export class SegmentExpression extends Expression {
    constructor(line: number, column: number, private s: string) {
        super(line, column,
            (scope) => s,
            () => Utils.toEscapedString(s));
    }

    toString(): string {
        return `Segment(${this.s})`;
    }
}

