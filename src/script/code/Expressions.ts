import {Scope, Expression} from "./Expression";
import * as Operations from "./Operations";
import {Quantity} from "./Quantity";
import {Unit} from "./Unit";
import * as Utils from "./Utils";

export class OperationExpression extends Expression {
    constructor(line: number, column: number, private symbol: string, private operation: (left: any, right: any) => any, private leftArgument: Expression, private rightArgument: Expression) {
        super(line, column,
            (scope) => operation(leftArgument.invoke(scope), rightArgument.invoke(scope)),
            () => `${leftArgument.describe()} ${symbol} ${rightArgument.describe()}`);
    }

    toString(): string {
        return `Operation(${this.leftArgument} ${this.symbol} ${this.rightArgument})`;
    }
}

export class UnaryOperationExpression extends Expression {
    constructor(line: number, column: number, private symbol: string, private operation: (value: any) => any, private argument: Expression) {
        super(line, column,
            (scope) => operation(argument.invoke(scope)),
            () => `${symbol}${argument.describe()}`);
    }

    toString(): string {
        return `UnaryOperation(${this.symbol}, ${this.argument})`;
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
        return `ParenthesesExpression(${this.argument})`;
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

export class ChainedQuantitiesExpression extends Expression {
    constructor(line: number, column: number, private left: Expression, private right: Expression) {
        super(line, column,
            (scope) => Operations.add(left.invoke(scope), right.invoke(scope)),
            () => `${left.describe()} ${right.describe()}`);
    }

    toString(): string {
        return `ChainQuantities(${this.left}, ${this.right})`;
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
            () => `$${name}`);
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

